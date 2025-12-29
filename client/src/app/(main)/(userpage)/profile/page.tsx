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

export default function MyProfile() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Profileheader />

        <ProfileWrapper>
          <LeftContent>
            <ProfileCard />
            <ResumeUpload />
            <ProfileStrength />
          </LeftContent>
          <RightContent>
            <BasicInformation />
            <Skills />
            <UserExperience />
            <UserEducation />
            <UserCerfication />
            <ProfileFooter />
          </RightContent>
        </ProfileWrapper>
      </div>
    </div>
  );
}
