"use client";

import { useState } from "react";
import { createClient } from "@/lib/supabase/client";
import { useRouter } from "next/navigation";
import { useAuth } from "@/providers/AuthProvider";
import {
    Upload,
    FileText,
    X,
    CheckCircle2,
    Loader2,
    Info,
    Tag
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function DocumentUploadPage() {
    const { profile } = useAuth();
    const router = useRouter();
    const supabase = createClient();

    const [file, setFile] = useState<File | null>(null);
    const [title, setTitle] = useState("");
    const [policyTag, setPolicyTag] = useState("");
    const [chapterTag, setChapterTag] = useState("");
    const [uploading, setUploading] = useState(false);
    const [progress, setProgress] = useState(0);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            setFile(e.target.files[0]);
            if (!title) setTitle(e.target.files[0].name.replace(".pdf", ""));
        }
    };

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !profile) return;

        setUploading(true);
        try {
            // 1. Upload to Storage
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${profile.organization_id}/${fileName}`;

            const { error: storageError } = await supabase.storage
                .from('documents')
                .upload(filePath, file);

            if (storageError) throw storageError;

            // 2. Create Database Record
            const { error: dbError } = await supabase
                .from('documents')
                .insert({
                    organization_id: profile.organization_id,
                    uploaded_by: profile.id,
                    title: title,
                    file_path: filePath,
                    file_name: file.name,
                    file_size: file.size,
                    file_type: 'pdf',
                    policy_tag: policyTag,
                    chapter_tag: chapterTag,
                    processing_status: 'pending'
                });

            if (dbError) throw dbError;

            router.push("/documents");
        } catch (error) {
            console.error(error);
            alert("Upload failed. Check console for details.");
            setUploading(false);
        }
    };

    return (
        <div className="p-8 max-w-3xl mx-auto">
            <div className="mb-10">
                <h1 className="text-3xl font-bold mb-2">Upload Document</h1>
                <p className="text-muted-foreground font-medium">Add new acts, regulations, or study materials to your organization track.</p>
            </div>

            <form onSubmit={handleUpload} className="space-y-8">
                <div className="bg-background border-2 border-dashed border-border rounded-[3rem] p-12 text-center relative group hover:border-primary/50 transition-all">
                    <input
                        type="file"
                        accept=".pdf"
                        onChange={handleFileChange}
                        className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />

                    {file ? (
                        <div className="flex flex-col items-center">
                            <div className="w-20 h-20 bg-primary/10 rounded-[2rem] flex items-center justify-center mb-4">
                                <FileText className="w-10 h-10 text-primary" />
                            </div>
                            <div className="font-bold text-lg mb-1">{file.name}</div>
                            <div className="text-xs text-muted-foreground font-bold uppercase tracking-wider">
                                {(file.size / 1024 / 1024).toFixed(2)} MB • PDF Document
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center">
                            <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mb-6 group-hover:bg-primary/10 transition-all">
                                <Upload className="w-8 h-8 text-muted-foreground group-hover:text-primary transition-all" />
                            </div>
                            <h3 className="text-xl font-bold mb-2">Drop your PDF here</h3>
                            <p className="text-muted-foreground font-medium">or click to browse from your device</p>
                        </div>
                    )}
                </div>

                <div className="grid gap-6">
                    <div className="space-y-2">
                        <label className="text-sm font-bold flex items-center gap-2">
                            Full Title
                        </label>
                        <input
                            required
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            className="w-full px-5 py-4 rounded-2xl border border-border focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                            placeholder="e.g. Nepal Civil Aviation Authority Act, 2053"
                        />
                    </div>

                    <div className="grid md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Policy / Act Tag
                            </label>
                            <input
                                value={policyTag}
                                onChange={e => setPolicyTag(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border border-border focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                placeholder="e.g. Civil Aviation Act"
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-bold flex items-center gap-2">
                                <Tag className="w-4 h-4" /> Chapter / Section Tag
                            </label>
                            <input
                                value={chapterTag}
                                onChange={e => setChapterTag(e.target.value)}
                                className="w-full px-5 py-4 rounded-2xl border border-border focus:ring-4 focus:ring-primary/10 transition-all outline-none"
                                placeholder="e.g. Chapter 1"
                            />
                        </div>
                    </div>
                </div>

                <div className="p-6 rounded-3xl bg-blue-50/50 border border-blue-100 flex gap-4 text-blue-800">
                    <Info className="w-6 h-6 shrink-0" />
                    <p className="text-sm font-medium leading-relaxed">
                        After uploading, our AI will process the document to extract key information and generate practice questions. This usually takes 1-2 minutes.
                    </p>
                </div>

                <button
                    disabled={uploading || !file}
                    className="w-full py-5 bg-primary text-white rounded-[2rem] font-bold flex items-center justify-center gap-2 hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-primary/30 disabled:opacity-50 disabled:scale-100"
                >
                    {uploading ? (
                        <div className="flex items-center gap-3">
                            <Loader2 className="w-6 h-6 animate-spin" />
                            <span>Uploading Document...</span>
                        </div>
                    ) : (
                        <>
                            <CheckCircle2 className="w-6 h-6" />
                            Confirm Upload
                        </>
                    )}
                </button>
            </form>
        </div>
    );
}
