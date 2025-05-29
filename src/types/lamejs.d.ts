declare module "lamejs" {
  export const MPEGMode: {
    STEREO: number;
    JOINT_STEREO: number;
    DUAL_CHANNEL: number;
    MONO: number;
    NOT_SET: number;
  };

  export class Mp3Encoder {
    constructor(channels: number, sampleRate: number, kbps: number);
    encodeBuffer(sample: Float32Array): Uint8Array;
    flush(): Uint8Array;
  }
}

// declare module "lamejs" {
//   class Mp3Encoder {
//     constructor(channels: number, sampleRate: number, kbps: number);
//     encodeBuffer(sample: Float32Array): Uint8Array;
//     flush(): Uint8Array;
//   }
//   export { Mp3Encoder };
// }

// declare module 'lamejs' {
//   export default class Mp3Encoder {
//     constructor(channels: number, sampleRate: number, kbps: number);
//     encodeBuffer(left: Float32Array): Uint8Array;
//     flush(): Uint8Array;
//   }
// }