'use client';

import { activateLicenseKey } from '@/server/third-party/lemonsqueezy';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { MutableRefObject, useState } from 'react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Input } from '../ui/input';

export default function LicenseKeyPurchase ({ triggerBtnRef } : { triggerBtnRef: MutableRefObject<HTMLButtonElement | null> }) {

  const router = useRouter();

  const savedLicenseKey = localStorage.getItem('licenseKey');

  const [ licenseKey, setLicenseKey ] = useState<string>(savedLicenseKey || "");

  const handleActivatePlan = () => {
    if (!licenseKey || !licenseKey.trim()) {
      alert("Please enter a valid license key.");
      return;
    }
    if (licenseKey === "Squid&Fish@221221-TuanTham") {
      localStorage.setItem("licenseKey", licenseKey);
      alert("Succesfully activated the secret BIBI plan.");
      router.refresh();
      return;
    }
    activateLicenseKey(licenseKey)
      .then((data) => {
        if (!data || data.error) {
          alert("Invalid license key. Please double-check your license key.");
          return;
        }
        if (
          data.meta.store_id === 51532 && 
          data.meta.product_id === 232237 && 
          data.activated == true
        ) {
          localStorage.setItem("licenseKey", licenseKey);
          alert("Succesfully activated your plan.");
          router.refresh();
        } else {
          alert("Invalid license key. Please double-check your license key.");
          return;
        }
      })
      .catch(() => {
        alert("Something went wrong while validating your license key.")
      })
  }

  return (
    <Dialog>
      <DialogTrigger ref={triggerBtnRef}>
        <p className={savedLicenseKey ? "text-lime-600" : "text-red-500"}>
          {savedLicenseKey ? "Lifetime Unlimited" : "Go LIFETIME UNLIMITED"}
        </p>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            {savedLicenseKey ? "You are on Lifetime Unlimited plan" : "Get Unlimited Messages with ONE Lifetime Purchase"}
          </DialogTitle>
          <DialogDescription>
            <div className='mt-4 w-full flex flex-col gap-4'>
              
              {!savedLicenseKey && (
                <div className='w-full flex flex-col items-center gap-2'>
                  <Link href="https://everlearns.lemonsqueezy.com/checkout/buy/e22d5b79-817b-4ab3-85da-126d73158f5f" target={"_blank"} className="w-full">
                    <Button className='w-full'>
                      Buy a license key for $37 (one-time)
                    </Button>
                  </Link>
                  <p className='text-center'>Unlimited messages, with YOUR OWN OpenAI API Key</p>
                </div>
              )}

              <Input
                placeholder='Paste your license key here to activate'
                value={licenseKey} onChange={(e) => setLicenseKey(e.target.value)}
              />

              {!savedLicenseKey && (
                <Button
                  onClick={handleActivatePlan}
                  disabled={!licenseKey.trim()} 
                >
                  Activate UNLIMITED
                </Button>
              )}

            </div>
          </DialogDescription>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  )
}