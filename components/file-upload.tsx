import { useEffect, useState } from "react";
import Image from "next/image";
import { convertBase64 } from "@/lib/utils";
import { Trash2 } from "lucide-react";
import { useTranslations } from "next-intl";

export const FileUploadFull = ({
	text,
	element,
	initialValue,
	handleJSONUpdate,
}: {
	text: string;
	element: "headshot_image" | "body_image";
	initialValue?: string;
	handleJSONUpdate: (
		imageType: "headshot_image" | "body_image",
		imageData: string
	) => void;
}) => {
	const t = useTranslations();
	const [preview, setPreview] = useState<string | null>(initialValue || null);

	// Update preview when initialValue changes
	useEffect(() => {
		setPreview(initialValue || null);
	}, [initialValue]);

	const handleChange = async (newValue: File | null) => {
		if (newValue) {
			try {
				const base64 = await convertBase64(newValue);
				if (typeof base64 === "string") {
					setPreview(base64);
					handleJSONUpdate(element, base64);
				}
			} catch (error) {
				console.error("Error converting file:", error);
			}
		} else {
			setPreview(null);
			handleJSONUpdate(element, "");
		}
	};

	return (
		<div className="flex items-center flex-col justify-center">
			<p className="text-md w-full text-start font-bold text-foreground mb-3">
				{text}
			</p>

			{preview && (
				<div className="relative w-full">
					<button
						className="bg-red-500 rounded p-1 m-2 absolute text-black right-0 top-0 text-sm hover:bg-red-400"
						onClick={(e) => {
							e.preventDefault();
							void handleChange(null);
						}}
					>
						<Trash2 />
					</button>
				</div>
			)}
			<label
				htmlFor={`${element}`}
				className="p-3 flex flex-col items-center justify-center w-full h-full bg-light-bg dark:bg-dark-input dark:hover:bg-dark-input-hover rounded-lg cursor-pointer border dark:border-dark-border hover:bg-light-bg"
			>
				<div className="flex flex-col items-center justify-center border rounded-lg border-dashed dark:border-dark-border p-2">
					{preview ? (
						<Image
            alt="preview"
            className="p-3 w-3/4"
            src={preview}
            width={300}
            height={100}
            layout="responsive"
						/>
					) : (
						<p className="text-center text-xs lowercase">
							<span className="font-bold">
								{t("file_upload.click_to_upload_label")}
							</span>{" "}
							{t("file_upload.drag_to_upload_label")}
						</p>
					)}
				</div>
				<input
					id={`${element}`}
					type="file"
					className="hidden"
					onChange={(e) => handleChange(e.target.files?.[0] ?? null)}
				/>
			</label>
		</div>
	);
};
