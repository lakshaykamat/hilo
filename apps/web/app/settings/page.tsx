"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { useAuth } from "../context/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useTheme } from "next-themes";

const SettingsPage = () => {
  const { setTheme, theme } = useTheme();
  const { logout, setNewProfilePhoto } = useAuth();
  const { toast } = useToast();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const router = useRouter();

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const changeProfilePicture = async () => {
    if (!selectedFile) return;

    setLoading(true);
    setError("");
    try {
      const formData = new FormData();
      formData.append("image", selectedFile);

      await setNewProfilePhoto(formData);

      toast({
        title: "Profile Picture Updated",
        description: "Your profile picture has been successfully updated.",
      });

      setSelectedFile(null);
      setImagePreview(null);
    } catch (err) {
      setError("Failed to update profile picture. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    setError("");
    try {
      await logout();
      router.push("/login");
    } catch (err) {
      setError("Failed to log out. Please try again.");
      setLoading(false);
    }
  };

  return (
    <>
      <h1 className="text-2xl sm:text-4xl font-bold mb-7">Settings</h1>

      <div className="flex justify-between items-center mb-6">
        <p className="text-lg">Change Profile Picture</p>

        <Dialog>
          <DialogTrigger asChild>
            <Button variant="secondary" size="sm">
              Upload
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Upload New Profile Picture</DialogTitle>
              <DialogDescription>
                Select a new profile picture to upload. You can preview it
                before confirming.
              </DialogDescription>
            </DialogHeader>

            <Input
              type="file"
              accept=".jpeg,.jpg,.png,.gif"
              onChange={handleFileChange}
              disabled={loading}
            />

            {imagePreview && (
              <div className="mt-4 flex justify-center">
                <img
                  src={imagePreview}
                  alt="Image Preview"
                  className="w-32 h-32 rounded-full object-cover shadow-lg"
                />
              </div>
            )}

            <div className="mt-6 flex justify-end gap-2">
              <DialogClose asChild>
                <Button
                  variant="outline"
                  onClick={() => {
                    setImagePreview(null);
                    setSelectedFile(null);
                  }}
                >
                  Cancel
                </Button>
              </DialogClose>
              <Button
                onClick={changeProfilePicture}
                disabled={loading || !selectedFile}
              >
                {loading ? "Uploading..." : "Confirm Upload"}
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex justify-between items-center mb-6">
        <span>Change Theme</span>
        <DropdownMenu>
          <DropdownMenuTrigger>
            <Button variant="secondary" size="sm">
              {theme && theme.charAt(0).toUpperCase() + theme.slice(1)}
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            {["system", "dark", "light"].map((mode) => (
              <DropdownMenuItem key={mode} onClick={() => setTheme(mode)}>
                {mode.charAt(0).toUpperCase() + mode.slice(1)}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {error && <p className="text-red-500 mb-4">{error}</p>}

      <div className="mt-8">
        <Button
          onClick={handleLogout}
          variant="destructive"
          disabled={loading}
          className="w-full"
        >
          {loading ? "Logging out..." : "Logout"}
        </Button>
      </div>
    </>
  );
};

export default SettingsPage;
