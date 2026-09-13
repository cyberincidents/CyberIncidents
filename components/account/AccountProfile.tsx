"use client";

import { useEffect, useRef, useState } from "react";
import { useSession } from "next-auth/react";

import ChangePassword from "@/components/account/ChangePassword";

type Profile = {
  id: string;
  name: string | null;
  email: string | null;
  image: string | null;
  role: "USER" | "ADMIN";
  hasPassword: boolean;
};

export default function AccountProfile() {
  const { update } = useSession();

  const fileInputRef =
    useRef<HTMLInputElement>(null);

  const previewUrlRef =
    useRef<string | null>(null);

  const [profile, setProfile] =
    useState<Profile | null>(null);

  const [name, setName] = useState("");
  const [image, setImage] =
    useState<string | null>(null);

  /*
   * Image selected by the user but not yet
   * saved to the database.
   */
  const [pendingImageFile, setPendingImageFile] =
    useState<File | null>(null);

  const [imagePreview, setImagePreview] =
    useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  /* =====================================================
     LOAD PROFILE
  ===================================================== */

  useEffect(() => {
    async function loadProfile() {
      try {
        const response = await fetch(
          "/api/account/profile",
          {
            method: "GET",
            cache: "no-store",
          }
        );

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error ||
              "Failed to load profile"
          );
        }

        setProfile(data);
        setName(data.name || "");
        setImage(data.image || null);
        setImagePreview(data.image || null);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load profile"
        );
      } finally {
        setLoading(false);
      }
    }

    loadProfile();
  }, []);

  /* =====================================================
     CLEANUP PREVIEW URL
  ===================================================== */

  useEffect(() => {
    return () => {
      if (previewUrlRef.current) {
        URL.revokeObjectURL(
          previewUrlRef.current
        );
      }
    };
  }, []);

  /* =====================================================
     SELECT PROFILE IMAGE
  ===================================================== */

  function handleImageChange(
    event: React.ChangeEvent<HTMLInputElement>
  ) {
    const file =
      event.target.files?.[0];

    if (!file) {
      return;
    }

    setError("");
    setMessage("");

    const allowedTypes = [
      "image/jpeg",
      "image/png",
      "image/webp",
    ];

    if (!allowedTypes.includes(file.type)) {
      setError(
        "Only JPG, PNG, and WebP images are allowed."
      );

      event.target.value = "";
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError(
        "Profile image must be 5MB or smaller."
      );

      event.target.value = "";
      return;
    }

    /*
     * Do NOT upload yet.
     *
     * Store the file locally and show a preview.
     * The actual upload happens when the user
     * clicks Save Changes.
     */
    setPendingImageFile(file);

    if (previewUrlRef.current) {
      URL.revokeObjectURL(
        previewUrlRef.current
      );
    }

    const previewUrl =
      URL.createObjectURL(file);

    previewUrlRef.current = previewUrl;

    setImagePreview(previewUrl);

    /*
     * Allow selecting the same file again.
     */
    event.target.value = "";
  }

  /* =====================================================
     SAVE PROFILE
  ===================================================== */

  async function handleSave(
    event: React.FormEvent<HTMLFormElement>
  ) {
    event.preventDefault();

    setError("");
    setMessage("");

    const trimmedName = name.trim();

    if (trimmedName.length < 2) {
      setError(
        "Name must contain at least 2 characters."
      );
      return;
    }

    if (trimmedName.length > 100) {
      setError(
        "Name must not exceed 100 characters."
      );
      return;
    }

    setSaving(true);

    try {
      let finalImage = image;

      /* =================================================
         UPLOAD NEW IMAGE IF ONE WAS SELECTED
      ================================================= */

      if (pendingImageFile) {
        const formData = new FormData();

        formData.append(
          "file",
          pendingImageFile
        );

        const uploadResponse =
          await fetch(
            "/api/account/upload",
            {
              method: "POST",
              body: formData,
            }
          );

        const uploadData =
          await uploadResponse.json();

        if (!uploadResponse.ok) {
          throw new Error(
            uploadData.error ||
              "Image upload failed"
          );
        }

        finalImage = uploadData.url;
      }

      /* =================================================
         UPDATE NAME + IMAGE TOGETHER
      ================================================= */

      const response = await fetch(
        "/api/account/profile",
        {
          method: "PATCH",
          headers: {
            "Content-Type":
              "application/json",
          },
          body: JSON.stringify({
            name: trimmedName,
            image: finalImage,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to update profile"
        );
      }

      /* =================================================
         UPDATE LOCAL PROFILE
      ================================================= */

      setProfile(data);
      setName(data.name || "");
      setImage(data.image || null);
      setImagePreview(data.image || null);

      /*
       * The pending image has now been saved.
       */
      setPendingImageFile(null);

      if (previewUrlRef.current) {
        URL.revokeObjectURL(
          previewUrlRef.current
        );

        previewUrlRef.current = null;
      }

      /* =================================================
         REFRESH AUTH SESSION
      ================================================= */

      await update({
        name: data.name,
        image: data.image,
      });

      setMessage(
        "Profile updated successfully."
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to update profile"
      );
    } finally {
      setSaving(false);
    }
  }

  /* =====================================================
     LOADING
  ===================================================== */

  if (loading) {
    return (
      <div className="space-y-8">
        <div className="rounded-2xl border border-slate-200 bg-white p-8 shadow-sm">
          <div className="animate-pulse space-y-5">
            <div className="mx-auto h-28 w-28 rounded-full bg-slate-100" />

            <div className="h-12 rounded-xl bg-slate-100" />

            <div className="h-12 rounded-xl bg-slate-100" />

            <div className="h-12 rounded-xl bg-slate-100" />
          </div>
        </div>
      </div>
    );
  }

  /* =====================================================
     ERROR
  ===================================================== */

  if (!profile) {
    return (
      <div className="rounded-2xl border border-red-200 bg-red-50 p-8">
        <p className="text-sm text-red-600">
          {error ||
            "Unable to load profile."}
        </p>
      </div>
    );
  }

  const displayName =
    profile.name?.trim() ||
    "CyberIncidents User";

  /*
   * Use the preview image when a new image
   * has been selected. Otherwise use the
   * saved database image.
   */
  const displayedImage =
    imagePreview || image;

  const firstLetter =
    displayName
      .charAt(0)
      .toUpperCase() || "U";

  /* =====================================================
     UI
  ===================================================== */

  return (
    <div className="space-y-8">
      {/* =================================================
          PROFILE CARD
      ================================================= */}

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">

        {/* =================================================
            PROFILE HEADER
        ================================================= */}

        <div className="border-b border-slate-200 bg-slate-50 px-8 py-8">
          <div className="flex flex-col items-center">

            {/* Avatar */}

            <div className="relative">
              {displayedImage ? (
                <img
                  src={displayedImage}
                  alt={displayName}
                  className="h-28 w-28 rounded-full border-4 border-white object-cover shadow-md"
                />
              ) : (
                <div className="flex h-28 w-28 items-center justify-center rounded-full border-4 border-white bg-slate-200 text-3xl font-bold text-slate-500 shadow-md">
                  {firstLetter}
                </div>
              )}

              {/* Edit button */}

              <button
                type="button"
                onClick={() =>
                  fileInputRef.current?.click()
                }
                disabled={saving}
                className="absolute bottom-0 right-0 flex h-9 items-center justify-center rounded-full border-2 border-white bg-slate-950 px-3 text-xs font-semibold text-white shadow-md transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Edit
              </button>
            </div>

            {/* Name */}

            <h2 className="mt-5 text-xl font-bold text-slate-950">
              {displayName}
            </h2>

            {/* Email */}

            <p className="mt-1 text-sm text-slate-500">
              {profile.email}
            </p>

            {/* Role */}

            <span className="mt-3 rounded-full bg-cyan-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-wider text-cyan-700">
              {profile.role === "ADMIN"
                ? "Administrator"
                : "Member"}
            </span>

            {/* Unsaved image indicator */}

            {pendingImageFile && (
              <p className="mt-3 text-xs font-medium text-amber-600">
                New profile image selected.
                Click Save Changes to apply it.
              </p>
            )}
          </div>
        </div>

        {/* =================================================
            HIDDEN FILE INPUT
        ================================================= */}

        <input
          ref={fileInputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          onChange={handleImageChange}
          className="hidden"
        />

        <p className="px-8 pt-5 text-center text-xs text-slate-400">
          JPG, PNG or WebP · Maximum 5MB
        </p>

        {/* =================================================
            PROFILE FORM
        ================================================= */}

        <form
          onSubmit={handleSave}
          className="space-y-6 p-8"
        >
          {/* Name */}

          <div>
            <label
              htmlFor="name"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Display Name
            </label>

            <input
              id="name"
              type="text"
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              maxLength={100}
              placeholder="Enter your name"
              disabled={saving}
              className="w-full rounded-xl border border-slate-300 bg-white px-4 py-3 text-sm text-slate-900 outline-none transition placeholder:text-slate-400 focus:border-cyan-500 focus:ring-2 focus:ring-cyan-100 disabled:bg-slate-50"
            />
          </div>

          {/* Email */}

          <div>
            <label
              htmlFor="email"
              className="mb-2 block text-sm font-semibold text-slate-800"
            >
              Email Address
            </label>

            <input
              id="email"
              type="email"
              value={profile.email || ""}
              disabled
              className="w-full cursor-not-allowed rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-500"
            />

            <p className="mt-2 text-xs text-slate-400">
              Your email address is used as
              your account identifier and
              cannot be changed here.
            </p>
          </div>

          {/* Error */}

          {error && (
            <div className="rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-600">
              {error}
            </div>
          )}

          {/* Success */}

          {message && (
            <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
              {message}
            </div>
          )}

          {/* Save */}

          <button
            type="submit"
            disabled={saving}
            className="w-full rounded-xl bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {saving
              ? "Saving Changes..."
              : "Save Changes"}
          </button>
        </form>
      </div>

      {/* =================================================
          SECURITY
      ================================================= */}

      {profile.hasPassword && (
        <ChangePassword />
      )}
    </div>
  );
}