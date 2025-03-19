import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { credentialSchema, Asset } from "@/schemas/credential";
import apiClient from "@/lib/apiService"; // API client
import { Credential } from "@/openapi-types";

type Mode = "create" | "import" | "view";

interface State {
	selectedCredential: Credential | null;
	mode: Mode;
	isCreating: boolean;
	isDeleting: boolean;
	credentials: Credential[];
}

interface Actions {
	setSelectedCredential: (credential: Credential | null) => void;
	startCreating: () => Promise<string>;
	startImporting: () => void;
	viewCredential: (credential: Credential) => void;
	cancel: () => void;
	reset: () => void;
	deleteCredential: (credentialId: string) => void;
}

export const useCredentials = create<State & Actions>()(
	immer((set, get) => ({
		selectedCredential: null,
		mode: "create",
		credentials: [],
		isCreating: false,
		isDeleting: false,

		deleteCredential: async () => {
			set((state) => {
				state.selectedCredential = null;
				state.mode = "create";
			});
		},

		setSelectedCredential: (credential) =>
			set((state) => {
				state.selectedCredential = credential;
			}),

		startCreating: async () => {
			set((state) => {
				state.selectedCredential = null;
				state.isCreating = true;
				state.mode = "create";
			});

			const newId = Date.now().toString();
			set((state) => {
				state.selectedCredential = { id: newId } as Credential;
			});

			return newId;
		},

		startImporting: () =>
			set((state) => {
				state.mode = "import";
				state.isCreating = false;
				state.selectedCredential = null;
			}),

		viewCredential: (credential) => {
			set((state) => {
				state.selectedCredential = credential; // Set the selected credential
				state.mode = "view"; // Set the mode to view
				state.isCreating = false; // Set isCreating to false since you're not creating
			});
		},

		// After viewing, ensure a full reset for creating:
		cancel: () => {
			set((state) => {
				state.selectedCredential = null; // Reset the selectedCredential
				state.isCreating = false; // Stop creating mode
				state.mode = "create"; // Switch back to create mode
			});
		},

		reset: () =>
			set((state) => {
				state.selectedCredential = null;
				state.mode = "create";
				state.isCreating = false;
			}),
	}))
);
