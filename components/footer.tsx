"use client";

import React, { MutableRefObject } from 'react';
import PreviousChatList from './chat/PreviousChatList';
import LicenseKeyPurchase from './chat/LicenseKeyPurchase';
import OpenAiApiKeyInput from './chat/OpenAiApiKeyInput';
import { ExternalLink } from './external-link';

interface FooterTextProps {
  className: string;
  licenseKeyPurchaseBtnRef: MutableRefObject<HTMLButtonElement | null>;
  openAiApiKeyInputBtnRef: MutableRefObject<HTMLButtonElement | null>;
}

export function FooterText({ licenseKeyPurchaseBtnRef, openAiApiKeyInputBtnRef }: FooterTextProps) {

  const licenseKey = localStorage.getItem('licenseKey');

  return (
    <div
      className='px-2 text-center text-xs leading-normal text-muted-foreground flex items-center justify-center gap-4'
    >
      <LicenseKeyPurchase triggerBtnRef={licenseKeyPurchaseBtnRef} />
      {licenseKey && <OpenAiApiKeyInput triggerBtnRef={openAiApiKeyInputBtnRef} />}
      <PreviousChatList />
      <div>
        <ExternalLink href='mailto:hi.everlearns@gmail.com'>
          Contact
        </ExternalLink>
      </div>
    </div>
  );
}
