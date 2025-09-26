import { useEffect, useState } from "react";
import { Button } from "reactstrap";
import ProfileTab from "@components/my-profile/profile-tab";
import ChangePasswordTab from "@components/my-profile/change-password-tab";
// import DeleteAccountTab from "@components/my-profile/delete-account-tab";
import { useLocation } from "react-router-dom";
import { useAppSelector } from "@/app/config/store";

const MyProfile = () => {
  const location = useLocation();
  const tabFromLocation = location.state?.tab;
  const [activeTab, setActiveTab] = useState(tabFromLocation || "profile");
  const account = useAppSelector((state) => state.authentication.account);

  useEffect(() => {
    if (tabFromLocation) {
      setActiveTab(tabFromLocation);
    }
  }, [tabFromLocation]);
  const isActive = (tab: string) => (activeTab === tab ? "active" : "");

  return (
    <article className="my-profile d-flex flex-column gap-  4">
      <header className="my-profile-header d-none d-lg-flex align-items-center gap-5">
        <Button
          className={`tab-btn ${isActive("profile")}`}
          onClick={() => setActiveTab("profile")}
        >
          Profile
        </Button>
        <Button
          className={`tab-btn ${isActive("change-password")}`}
          onClick={() => setActiveTab("change-password")}
        >
          Change Password
        </Button>
        {/* <Button
          className={`tab-btn ${isActive("delete-account")}`}
          onClick={() => setActiveTab("delete-account")}
        >
          Delete Account
        </Button> */}
      </header>
      <section className="my-profile-body mt-lg-4">
        {activeTab === "profile" && <ProfileTab userId={account.id} />}
        {activeTab === "change-password" && <ChangePasswordTab />}
        {/* {activeTab === "delete-account" && <DeleteAccountTab />} */}
      </section>
    </article>
  );
};

export default MyProfile;
