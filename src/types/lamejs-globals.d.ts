// src/types/lamejs-globals.d.ts
import type { MPEGMode as ImportedMPEGMode } from "lamejs";

declare global {
  interface GlobalThis {
    /** expose the lamejs constants to legacy code */
    MPEGMode: typeof ImportedMPEGMode;
  }
}
