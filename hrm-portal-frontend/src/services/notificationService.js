import api from "./api";

const notificationService = {

  async getNotifications({
    page = 0,
    size = 20,
    unreadOnly = false
  } = {}) {

    const response = await api.get("/notifications");
    const notifications = response.data || [];

    return unreadOnly
      ? notifications.filter(({ status }) => status === "UNREAD")
      : notifications.slice(page * size, (page + 1) * size);
  },


  async getUnreadCount() {

    const response = await api.get(
      "/notifications/unread-count"
    );

    return response.data;
  },


  async markAsRead(notificationId) {

    if (!notificationId) {
      throw new Error(
        "Notification ID is required."
      );
    }

    const response = await api.put(
      `/notifications/${notificationId}/read`
    );

    return response.data;
  },


  async markAllAsRead() {

    const response = await api.put(
      "/notifications/read-all"
    );

    return response.data;
  },


  async deleteNotification(
    notificationId
  ) {

    if (!notificationId) {
      throw new Error(
        "Notification ID is required."
      );
    }

    const response = await api.delete(`/notifications/${notificationId}`);

    return response.data;
  }

};

export default notificationService;
