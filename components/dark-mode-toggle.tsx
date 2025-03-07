"use client";

import { useMounted } from "@/hooks/use-mounted";
import { Sun, Moon } from "lucide-react";
import { useTheme } from "next-themes";
import { Skeleton } from "./ui/skeleton";

export const DarkModeToggle = ({ isExpanded }: any) => {
	const { theme, setTheme } = useTheme();
	const isMounted = useMounted();

	const toggleDarkMode = () => {
		setTheme(theme === "dark" ? "light" : "dark");
	};

	if (!isMounted) {
		return (
			<Skeleton className="border-2 w-16 h-9 bg-transparent rounded-full" />
		);
	}

	return (
		<button onClick={toggleDarkMode}>
			<div
				className={`rounded-full p-1 px-2 transition-all border  border-gray-200 dark:border-dark-border ${
					isExpanded ? "w-18" : "w-8"
				} bg-light-bg dark:bg-dark-bg flex items-center`}
			>
				{theme === "dark" ? (
					<Sun
						className={`transition-all text-yellow-300 ${
							isExpanded ? "w-6 h-6 ml-7" : "w-5 h-5"
						}`}
					/>
				) : (
					<Moon
						className={`transition-all ${
							isExpanded ? "w-6 h-6 mr-6" : "w-5 h-5"
						}`}
					/>
				)}
			</div>
		</button>
	);
};
