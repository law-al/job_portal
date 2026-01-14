import ProfileCard from './components/ProfileCard';
import ResumeUpload from './components/ResumeUpload';
import ProfileStrength from './components/ProfileStrength';
import BasicInformation from './components/BasicInformation';
import Skills from './components/Skills';
import UserExperience from './components/UserExperience';
import UserEducation from './components/UserEducation';
import ProfileFooter from './components/ProfileFoooter';
import UserCerfication from './components/UserCerfication';
import LeftContent from './components/LeftContent';
import RightContent from './components/RightContent';
import Profileheader from './components/Profileheader';
import ProfileWrapper from './components/ProfileWrapper';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/auth';
import { fetchWithRetry } from '@/lib/fetchWithRetry';
import type { Profile, ProfileResponse } from '@/types';

export default async function MyProfile() {
  const session = await getServerSession(authOptions);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (session?.user as any)?.id;

  let profileData: Profile | null = null;

  if (session && userId) {
    try {
      const response = await fetchWithRetry({
        url: 'profile',
        options: {
          method: 'GET',
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            Authorization: `Bearer ${((session?.user as any)?.accessToken as string) ?? ''}`,
          },
        },
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        refreshTokenHash: (session.user as any)?.refreshTokenHash,
      });

      if (response.ok) {
        const data = (await response.json()) as ProfileResponse;
        profileData = data.data?.profile || null;
      }
    } catch (error) {
      console.error('Error fetching profile:', error);
    }
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Profileheader />

        <ProfileWrapper>
          <LeftContent>
            <ProfileCard
              userInfo={{
                firstName: profileData?.user?.firstName || null,
                lastName: profileData?.user?.lastName || null,
                email: profileData?.user?.email || null,
                phone: profileData?.phone || null,
                profileImage: profileData?.user?.profileImage || null,
              }}
              contactInfo={{
                linkedin: profileData?.linkedin || null,
                github: profileData?.github || null,
                location: profileData?.location || null,
              }}
            />
            <ResumeUpload />
            <ProfileStrength />
          </LeftContent>
          <RightContent>
            <BasicInformation
              basicInfo={{
                firstName: profileData?.user?.firstName || null,
                lastName: profileData?.user?.lastName || null,
                professionalHeadline: profileData?.professionalHeadline || null,
                aboutMe: profileData?.aboutMe || null,
              }}
            />
            <Skills skills={profileData?.skills || []} />
            <UserExperience experiences={profileData?.experiences ? (Array.isArray(profileData.experiences) ? profileData.experiences : []) : []} />
            <UserEducation education={profileData?.education ? (Array.isArray(profileData.education) ? profileData.education : []) : []} />
            <UserCerfication certifications={profileData?.certifications ? (Array.isArray(profileData.certifications) ? profileData.certifications : []) : []} />
            <ProfileFooter />
          </RightContent>
        </ProfileWrapper>
      </div>
    </div>
  );
}
