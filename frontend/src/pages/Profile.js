import React from "react";
import styled from "styled-components";
import { useUser } from "../stores/userStore";
import "typeface-rubik";

const Profile = () => {
  const user = useUser();
  console.log(user);
  if (!user) {
    return (
      <Page>
        <ProfileContainer>
          <Title>Profile</Title>
          <Message>No user data available</Message>
        </ProfileContainer>
      </Page>
    );
  }

  return (
    <Page>
      <ProfileContainer>
        <Title>Profile</Title>

        <ProfileSection>
          <SectionTitle>Personal Information</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>First Name:</Label>
              <Value>{user.first_nm || "Not provided"}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Last Name:</Label>
              <Value>{user.last_nm || "Not provided"}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Email:</Label>
              <Value>{user.email || "Not provided"}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Role:</Label>
              <Value>{user.role || "Not provided"}</Value>
            </InfoItem>
            <InfoItem>
              <Label>Organization:</Label>
              <Value>{user.org_name || "Not provided"}</Value>
            </InfoItem>
          </InfoGrid>
        </ProfileSection>

        <ProfileSection>
          <SectionTitle>Account Information</SectionTitle>
          <InfoGrid>
            <InfoItem>
              <Label>Account Type:</Label>
              <Value>
                {user.role === "COACH"
                  ? "Coach"
                  : user.role === "ATHLETE"
                  ? "Athlete"
                  : "Unknown"}
              </Value>
            </InfoItem>
            <InfoItem>
              <Label>Status:</Label>
              <StatusBadge active={true}>Active</StatusBadge>
            </InfoItem>
          </InfoGrid>
        </ProfileSection>
      </ProfileContainer>
    </Page>
  );
};

const Page = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  height: 90vh;
  font-family: "Rubik", sans-serif;
  padding: 20px;
`;

const ProfileContainer = styled.div`
  width: 100%;
  max-width: 800px;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.1);
  padding: 30px;
`;

const Title = styled.h1`
  font-size: 2.5rem;
  color: #1976d2;
  margin-bottom: 30px;
  text-align: center;
  font-weight: bold;
`;

const ProfileSection = styled.div`
  margin-bottom: 30px;
  padding: 20px;
  background: #f8f9fa;
  border-radius: 8px;
  border-left: 4px solid #1976d2;
`;

const SectionTitle = styled.h2`
  font-size: 1.5rem;
  color: #333;
  margin-bottom: 20px;
  font-weight: 600;
`;

const InfoGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 20px;
`;

const InfoItem = styled.div`
  display: flex;
  flex-direction: column;
  gap: 5px;
`;

const Label = styled.span`
  font-size: 0.9rem;
  color: #666;
  font-weight: 500;
  text-transform: uppercase;
  letter-spacing: 0.5px;
`;

const Value = styled.span`
  font-size: 1.1rem;
  color: #333;
  font-weight: 500;
  padding: 8px 12px;
  background: white;
  border-radius: 6px;
  border: 1px solid #e0e0e0;
`;

const StatusBadge = styled.span`
  display: inline-block;
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  background: ${(props) => (props.active ? "#4caf50" : "#f44336")};
  color: white;
  width: fit-content;
`;

const Message = styled.div`
  text-align: center;
  font-size: 1.2rem;
  color: #666;
  padding: 40px;
`;

export default Profile;
