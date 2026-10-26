import { useEffect, useState } from 'react'
import { useChatStore } from '../store/useChatStore'
import { Loader } from 'lucide-react'
import '../ui/Sidebar.css'
import { useAuthStore } from '../store/useAuthStore'

const Sidebar = () => {
    const { getUsers, users, setSelectedUsers, isUsersLoading } = useChatStore();
    const { onlineUsers } = useAuthStore();
    const [onlineOnly, setOnlineOnly] = useState(false);
    const visibleUsers = users.filter((user) => (
        !onlineOnly || onlineUsers.includes(user._id)
    ));

    useEffect(() => {
        getUsers()
    }, [getUsers])

    if (isUsersLoading) {
        return (
            <aside className="sidebar sidebar-loading" aria-label="Contacts">
                <Loader className="sidebar-spinner" aria-label="Loading contacts" />
            </aside>
        )
    }

    return (
        <aside className="sidebar" aria-label="Contacts">
            <div className="sidebar-header">
                <div>
                    <h2>Contacts</h2>
                    <p>Start a conversation</p>
                </div>
                <button
                    className={`sidebar-online-filter ${onlineOnly ? 'is-active' : ''}`}
                    type="button"
                    aria-pressed={onlineOnly}
                    onClick={() => setOnlineOnly((current) => !current)}
                >
                    <span className="sidebar-filter-dot" aria-hidden="true" />
                    Online only
                </button>
            </div>

            <div className="sidebar-users">
                {visibleUsers.map((user) => (
                    <button
                        className="sidebar-user"
                        key={user._id}
                        onClick={() => setSelectedUsers(user)}
                        type="button"
                    >
                        <span className="sidebar-avatar">
                            <img
                                src={user.profilePic || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQh8yCap-OFEzeJLnZAtzinq6qTDowXUNgKJpzN66oAneVnkpNz8hOoJcQ&s=10'}
                                alt=""
                            />
                            {onlineUsers.includes(user._id) && (
                                <span className="presence-indicator" aria-label="Online" />
                            )}
                        </span>
                        <span className="sidebar-user-details">
                            <span className="sidebar-user-name">{user.fullName}</span>
                            <span className={`sidebar-user-status ${onlineUsers.includes(user._id) ? 'is-online' : ''}`}>
                                {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
                            </span>
                        </span>
                    </button>
                ))}
                {visibleUsers.length === 0 && (
                    <p className="sidebar-empty">
                        {onlineOnly ? 'No users are online right now.' : 'No contacts yet.'}
                    </p>
                )}
            </div>
        </aside>
    )
}

export default Sidebar
