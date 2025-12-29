import React from 'react';
import Tabs from '../Tabs';
import PlatformIdentity from './PlatformIdentity';
import Branding from './Branding';
import Localization from './Localization';
import SocialPresence from './SocialPresence';
import AdvanceOperations from './AdvanceOperations';
import { Grid3Columns } from '@/components/Grid';
import SubHeader from './SubHeader';

export default function General() {
  return (
    <>
      <Grid3Columns>
        <PlatformIdentity />
        <Branding />
        <Localization />
        <SocialPresence />
        <AdvanceOperations />
      </Grid3Columns>
    </>
  );
}
