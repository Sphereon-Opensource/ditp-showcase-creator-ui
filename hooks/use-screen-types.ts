// use-screen-types.ts
import {useMemo} from 'react'

export interface ScreenType {
    value: string
    label: string
}

export function useScreenTypes(): ScreenType[] {
    return useMemo(() => [
        {value: 'PICK_CHARACTER', label: 'Pick Character'},
        {value: 'SETUP_START', label: 'Setup Start'},
        {value: 'GOING_DIGITAL', label: 'Going Digital'},
        {value: 'ACCESS_COURT_MATERIALS', label: 'Access Court Materials'},
        {value: 'CONNECT_LSBC', label: 'Connect to Law Society of British Columbia'},
        {value: 'ACCEPT_LSBC', label: 'Accept Law Society of British Columbia'},
        {value: 'CONNECT_PERSON', label: 'Connect Person'},
        {value: 'ACCEPT_PERSON', label: 'Accept Person'},
        {value: 'CHOOSE_WALLET', label: 'Choose Wallet'},
        {value: 'ACCEPT_CREDENTIAL', label: 'Accept Credential'},
        {value: 'SETUP_COMPLETED', label: 'Setup Completed'},
        {value: 'PROOF', label: 'Proof'},
        {value: 'CONNECTION', label: 'Connection'},
        {value: 'INFO', label: 'Info'},
        {value: 'START', label: 'Step start'},
        {value: 'STEP_END', label: 'Step end'},
    ], [])
}