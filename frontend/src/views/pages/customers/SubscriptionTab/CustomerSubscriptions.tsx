import React, { useState, Dispatch, SetStateAction, useEffect } from 'react';
import {
  Typography,
  Divider,
  List,
  ListItem,
  ListItemText,
  Button,
  Box,
  Chip,
} from '@mui/material';
import { Icon } from '@iconify/react';
import { Customer, Service, Subscription } from '@/models/dataType';
import AddSubscriptionModal from '@/components/subscriptions/AddSubscription';
import UpdateSubscriptionModal from '@/components/subscriptions/UpdateSubscriptionModal';
import { fetchBackendPOST, fetchBackendPUT, fetchBackendDELETE, fetchBackendGET } from '@/utils/backendFetch';
import { getMembershipStatus } from '@/utils/isMembershipActive';
import { capitalizeFirstLetter } from '@/utils/capitalizeFirstLetter';
import { useRouter } from 'next/router';

interface CustomerSubscriptionsProps {
  services: Service[] | null;
}

const CustomerSubscriptions: React.FC<CustomerSubscriptionsProps> = ({
  services,
}) => {
  const [openSubscriptionModal, setOpenSubscriptionModal] = useState<boolean>(false);
  const [openSubscriptionUpdateModal, setOpenSubscriptionUpdateModal] = useState<boolean>(false);
  const [selectedSubscription, setSelectedSubscription] = useState<Subscription | null>(null);
  const [subscriptions, setSubscriptions] = useState<Subscription[] | null>(null);
  const router = useRouter()
  const { customerId } = router.query;

  const handleAddSubscription = async (data: {
    customerId: string;
    serviceId: string;
    durationDays: number;
    startDate: string;
    sessionLimit?: number;
    fee?: number;
  }) => {
    try {
      const response = await fetchBackendPOST('/subscription/add', data);
      if (response.ok) {
        const { subscription } = await response.json();
        alert('Subscription added successfully');

        // Yeni abonelik ekleme
        setSubscriptions((prevSubscriptions) => (prevSubscriptions ? [...prevSubscriptions, subscription] : [subscription]));
      } else {
        const errorData = await response.json();
        alert(`Error adding subscription: ${errorData.message}`);
      }
    } catch (error) {
      console.error('Error:', error);
      alert('An unexpected error occurred while adding the subscription.');
    }
  };

  const handleUpdateSubscription = async (data: {
    subscriptionId: string;
    durationDays?: number;
    startDate?: string;
    sessionLimit?: number;
    fee?: number;
  }) => {
    try {
      const response = await fetchBackendPUT(`/subscription/${data.subscriptionId}`, data);

      if (response.ok) {
        const { subscription } = await response.json();

        // Aboneliği güncelleme
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions?.map((sub) => (sub._id === subscription._id ? subscription : sub)) || []
        );

        alert('Subscription updated successfully.');
      } else {
        alert('Error updating subscription.');
      }
    } catch (error) {
      console.error('Error updating subscription:', error);
    }
  };

  const handleDeleteSubscription = async (subscriptionId: string) => {
    try {
      const response = await fetchBackendDELETE(`/subscription/${subscriptionId}`);
      if (response.ok) {
        alert('Subscription deleted successfully');

        // Aboneliği silme
        setSubscriptions((prevSubscriptions) =>
          prevSubscriptions?.filter((sub) => sub._id !== subscriptionId) || []
        );
      } else {
        alert('Error deleting subscription.');
      }
    } catch (error) {
      console.error('Error deleting subscription:', error);
    }
  };


  const getSubscriptions = async () => {
    if (!customerId) return;

    try {
      const response = await fetchBackendGET(`/subscription/${customerId}`);
      if (response.ok) {
        const data = await response.json();
        setSubscriptions(data);
      } else {
        setSubscriptions(null);
      }
    } catch (error) {
      console.error('Error fetching subscriptions:', error);
      setSubscriptions(null);
    }
  };

  useEffect(() => {
    getSubscriptions();
  }, [customerId]);

  return (
    <div>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">Abonelikler</Typography>
        <Button onClick={() => setOpenSubscriptionModal(true)} variant="contained" size="small">
          Ekle
        </Button>
      </Box>
      <UpdateSubscriptionModal
        open={openSubscriptionUpdateModal}
        onClose={() => setOpenSubscriptionUpdateModal(false)}
        onSubmit={handleUpdateSubscription}
        subscription={selectedSubscription!}
      />
      <AddSubscriptionModal
        open={openSubscriptionModal}
        onClose={() => setOpenSubscriptionModal(false)}
        onSubmit={handleAddSubscription}
        services={services}
        customerId={customerId as string}
      />
      <Divider sx={{ my: 2 }} />
      {subscriptions && subscriptions?.length > 0 ? (
    <List>
        {subscriptions?.map((subscription) => {
            const serviceType = subscription.serviceType
                ? capitalizeFirstLetter(subscription.serviceType)
                : 'Bilinmiyor';

            const { isActive, daysLeft } = getMembershipStatus(
                subscription.startDate,
                subscription.durationDays
            );

            const remainingBalance = subscription.remainingBalance || 0; // Backend'den kalan borç bilgisi
            const isPaid = remainingBalance <= 0; // Ödenmiş mi kontrolü

            return (
                <ListItem key={subscription._id} sx={{ borderBottom: '1px solid #e0e0e0' }}>
                    <ListItemText
                        primary={
                            <>
                                <Typography variant="h6">{serviceType}</Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {`Abonelik ID: ${subscription._id}`}
                                </Typography>
                            </>
                        }
                        secondary={
                            <>
                                <Typography variant="body2" color="textSecondary">
                                    {`Başlangıç: ${new Date(subscription.startDate).toLocaleDateString()}`}
                                </Typography>
                                <Typography variant="body2" color="textSecondary">
                                    {`Kalan Gün: ${daysLeft}`}
                                </Typography>
                                <Typography
                                    variant="body2"
                                    color={isPaid ? 'success.main' : 'error.main'}
                                >
                                    {isPaid ? 'Ödendi' : `Kalan Borç: ${remainingBalance} TL`}
                                </Typography>
                            </>
                        }
                    />

                    <Chip label={isActive ? 'Aktif' : 'Pasif'} color={isActive ? 'success' : 'default'} />

                    <Button
                        sx={{ mr: 3, ml: 3 }}
                        onClick={() => {
                            setSelectedSubscription(subscription);
                            setOpenSubscriptionUpdateModal(true);
                        }}
                        variant="contained"
                        color="info"
                        size="small"
                        startIcon={<Icon icon="mdi:pencil" />}
                    >
                        Düzenle
                    </Button>
                    <Button
                        onClick={() => handleDeleteSubscription(subscription._id)}
                        variant="contained"
                        color="error"
                        size="small"
                        startIcon={<Icon icon="mdi:delete" />}
                    >
                        Sil
                    </Button>
                </ListItem>
            );
        })}
    </List>
) : (
    <Typography color="text.secondary">Aktif abonelik bulunmamaktadır.</Typography>
)}

    </div>
  );
};

export default CustomerSubscriptions;
