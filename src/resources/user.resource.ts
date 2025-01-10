import { UUID } from "node:crypto"

export interface GetLinkedInUser {
    identifier: number,
    connexikId: string,
    isScanned: boolean,
    isLoggedIn: boolean,
    rescanTs: string
}

export interface BasicLinkedInUser {
    id: number,
    identifier: number,
    username: string,
    uuid: string,
    lastScannedAt: Date
}

export interface LinkedInUserDataDetail {
    location: {
      city: string;
      state: string;
      country: string;
    };
    summary: string;
    experience: {
      company: string;
      title: string;
      years: string;
      location: string;
    }[];
    education: {
      school: string;
      degree: string;
      years: string;
    }[];
    skills: string[];
    recommendations: {
      name: string;
      title: string;
      text: string;
    }[];
    interests: {
      name?: string; // Optional for cases like company or group interests
      title?: string;
      company?: string;
      group?: string;
      newsletter?: string;
      school?: string;
    }[];
  }