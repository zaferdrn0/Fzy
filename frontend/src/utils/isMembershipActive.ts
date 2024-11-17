export const getMembershipStatus = (
    membershipStartDate: string,
    membershipDuration?: number
  ): { isActive: boolean; daysLeft: number } => {
    if (!membershipStartDate || !membershipDuration) {
      return { isActive: false, daysLeft: 0 };
    }
  
    const startDate = new Date(membershipStartDate);
    const today = new Date();
  
    const endDate = new Date(startDate.getTime() + membershipDuration * 24 * 60 * 60 * 1000);
  
    const isActive = today <= endDate;
    const daysLeft = isActive
      ? Math.ceil((endDate.getTime() - today.getTime()) / (24 * 60 * 60 * 1000))
      : 0;
  
    return { isActive, daysLeft };
  };
  