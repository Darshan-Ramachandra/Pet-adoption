import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { FaBell } from 'react-icons/fa';

const NotificationCenter = () => {
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const fetchNotifications = async () => {
    try {
      const response = await axiosSecure.get(`/notifications/${user.email}`);
      console.log('Fetched notifications:', response.data);
      setNotifications(response.data);
      setUnreadCount(response.data.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error fetching notifications:', error);
    }
  };

  useEffect(() => {
    if (user?.email) {
      fetchNotifications();
      
      // Set up periodic refresh every 30 seconds
      const intervalId = setInterval(fetchNotifications, 30000);
      
      // Cleanup interval on unmount
      return () => clearInterval(intervalId);
    }
  }, [user]);

  const markAsRead = async (notificationId) => {
    try {
      await axiosSecure.patch(`/notifications/${notificationId}/read`);
      setNotifications(notifications.map(n => 
        n._id === notificationId ? { ...n, read: true } : n
      ));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (error) {
      console.error('Error marking notification as read:', error);
    }
  };

  const getTimeAgo = (timestamp) => {
    const now = new Date();
    const date = new Date(timestamp);
    const seconds = Math.floor((now - date) / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days} day${days === 1 ? '' : 's'} ago`;
    if (hours > 0) return `${hours} hour${hours === 1 ? '' : 's'} ago`;
    if (minutes > 0) return `${minutes} minute${minutes === 1 ? '' : 's'} ago`;
    return 'Just now';
  };

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="btn btn-ghost btn-circle relative"
      >
        <FaBell className="text-xl" />
        {unreadCount > 0 && (
          <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs">
            {unreadCount}
          </div>
        )}
      </button>

      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 max-w-md bg-base-100 rounded-lg shadow-lg overflow-hidden z-50">
          <div className="p-4 border-b">
            <div className="flex justify-between items-center">
              <h3 className="font-semibold">Notifications</h3>
              {unreadCount > 0 && (
                <span className="text-xs text-gray-500">{unreadCount} unread</span>
              )}
            </div>
          </div>

          <div className="divide-y max-h-[70vh] overflow-auto">
            {notifications.length === 0 ? (
              <p className="py-4 text-center text-gray-500">No notifications yet</p>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification._id}
                  className={`p-4 hover:bg-base-200 cursor-pointer transition-colors duration-200 ${
                    !notification.read ? 'bg-base-200' : ''
                  }`}
                  onClick={() => markAsRead(notification._id)}
                >
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex-1">
                      <p className={`${!notification.read ? 'font-semibold' : ''} text-sm`}>
                        {notification.message}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {getTimeAgo(notification.createdAt)}
                      </p>
                    </div>
                    {notification.type === 'accepted' ? (
                      <span className="badge badge-success badge-sm whitespace-nowrap">Accepted</span>
                    ) : notification.type === 'rejected' ? (
                      <span className="badge badge-error badge-sm whitespace-nowrap">Rejected</span>
                    ) : null}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter; 