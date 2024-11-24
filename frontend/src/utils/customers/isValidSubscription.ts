import { Subscription } from "@/models/dataType";

export const isSubscriptionValid = (subscription: Subscription): boolean => {
    const currentDate = new Date();
    const subscriptionEndDate = new Date(subscription.startDate);
    subscriptionEndDate.setDate(subscriptionEndDate.getDate() + subscription.durationDays);
    return currentDate <= subscriptionEndDate; // Süresi dolmamışsa true döner
};