import ProfileUpload from '../../components/form/ProfileUpload';
import PersonalInfo from '../../components/form/PersonalInfo';
import CredentialsUpload from '../../components/form/CredentialUpload';
import FormActions from '../../components/form/FormAction';
import DetailForm from '../../components/form/detailform';

export default function MainContent() {
  return (
    <main className="p-6 bg-gray-50 min-h-screen">

      {/* Top section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-6">
        <ProfileUpload />
        <div className="lg:col-span-2">
          <PersonalInfo />
        </div>
      </div>

      {/* Details */}
      <div className="mt-6">
        <DetailForm />
      </div>

      {/* Credentials */}
      <div className="mt-6">
        <CredentialsUpload />
      </div>

      {/* Actions */}
      <div className="mt-6">
        <FormActions />
      </div>
    </main>
  );
}