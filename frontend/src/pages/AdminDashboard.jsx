import { useEffect, useState } from "react";
import {
    LayoutDashboard,
    Users,
    Store,
    Star,
    Plus,
    LogOut,
    Search,
    ArrowUpDown,
    Eye,
    Trash2,
    X,
    RefreshCw,
    UserPlus,
    ShieldCheck,
    Activity,
    UserRound,
    Mail,
    MapPin,
    ChevronRight,
    AlertTriangle
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import "./AdminDashboard.css";

const AdminDashboard = () => {
    const navigate = useNavigate();

    const [activeSection, setActiveSection] = useState("overview");

    const [stats, setStats] = useState({
        totalUsers: 0,
        totalStores: 0,
        totalRatings: 0,
        totalOwners: 0
    });

    const [users, setUsers] = useState([]);
    const [stores, setStores] = useState([]);
    const [owners, setOwners] = useState([]);
    const [storeRatings, setStoreRatings] = useState([]);

    const [selectedUser, setSelectedUser] = useState(null);
    const [selectedStore, setSelectedStore] = useState(null);

    const [loading, setLoading] = useState(true);
    const [usersLoading, setUsersLoading] = useState(false);
    const [storesLoading, setStoresLoading] = useState(false);
    const [ratingsLoading, setRatingsLoading] = useState(false);
    const [detailsLoading, setDetailsLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const [showUserForm, setShowUserForm] = useState(false);
    const [showStoreForm, setShowStoreForm] = useState(false);
    const [showUserDetails, setShowUserDetails] = useState(false);
    const [showRatings, setShowRatings] = useState(false);
    const [showDeleteUser, setShowDeleteUser] = useState(false);
    const [showDeleteStore, setShowDeleteStore] = useState(false);

    const [userToDelete, setUserToDelete] = useState(null);
    const [storeToDelete, setStoreToDelete] = useState(null);

    const [userFilters, setUserFilters] = useState({
        name: "",
        email: "",
        address: "",
        role: ""
    });

    const [storeFilters, setStoreFilters] = useState({
        name: "",
        email: "",
        address: ""
    });

    const [userSort, setUserSort] = useState({
        sortBy: "name",
        order: "asc"
    });

    const [storeSort, setStoreSort] = useState({
        sortBy: "name",
        order: "asc"
    });

    const [userForm, setUserForm] = useState({
        name: "",
        email: "",
        address: "",
        password: "",
        role: "user"
    });

    const [storeForm, setStoreForm] = useState({
        name: "",
        email: "",
        address: "",
        owner_id: ""
    });

    const getInitials = (name = "") => {
        const words = name.trim().split(/\s+/);

        if (words.length === 1) {
            return words[0].slice(0, 2).toUpperCase();
        }

        return `${words[0]?.[0] || ""}${words[1]?.[0] || ""}`.toUpperCase();
    };

    const getRoleLabel = (role) => {
        if (role === "admin") {
            return "Admin";
        }

        if (role === "store_owner") {
            return "Store Owner";
        }

        return "Normal User";
    };

    const showSuccessMessage = (text) => {
        setMessage(text);

        setTimeout(() => {
            setMessage("");
        }, 3000);
    };

    const loadStats = async () => {
        const response = await api.get("/admin/dashboard");

        setStats((current) => ({
            totalUsers: Number(response.data.totalUsers || 0),
            totalStores: Number(response.data.totalStores || 0),
            totalRatings: Number(response.data.totalRatings || 0),
            totalOwners:
                response.data.totalOwners !== undefined
                    ? Number(response.data.totalOwners || 0)
                    : current.totalOwners
        }));
    };

    const loadUsers = async (
        filters = userFilters,
        sort = userSort
    ) => {
        try {
            setUsersLoading(true);

            const response = await api.get("/admin/users", {
                params: {
                    ...filters,
                    sortBy: sort.sortBy,
                    order: sort.order
                }
            });

            setUsers(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to load users"
            );
        } finally {
            setUsersLoading(false);
        }
    };

    const loadStores = async (
        filters = storeFilters,
        sort = storeSort
    ) => {
        try {
            setStoresLoading(true);

            const response = await api.get("/admin/stores", {
                params: {
                    ...filters,
                    sortBy: sort.sortBy,
                    order: sort.order
                }
            });

            setStores(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to load stores"
            );
        } finally {
            setStoresLoading(false);
        }
    };

    const loadOwners = async () => {
        try {
            const response = await api.get("/admin/users", {
                params: {
                    role: "store_owner",
                    sortBy: "name",
                    order: "asc"
                }
            });

            const ownerList = Array.isArray(response.data)
                ? response.data
                : response.data?.users || [];

            const validOwners = ownerList.filter(
                (user) => user.role === "store_owner"
            );

            setOwners(validOwners);

            setStats((current) => ({
                ...current,
                totalOwners: validOwners.length
            }));
        } catch (error) {
            setOwners([]);

            setError(
                error.response?.data?.message ||
                    "Unable to load store owners"
            );
        }
    };

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            await Promise.all([
                loadStats(),
                loadUsers(),
                loadStores(),
                loadOwners()
            ]);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to load dashboard"
            );
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        loadDashboard();
    }, []);

    const changeSection = (section) => {
        setActiveSection(section);
        setError("");
        setMessage("");

        window.scrollTo({
            top: 0,
            behavior: "smooth"
        });
    };

    const handleUserFilter = (event) => {
        const filters = {
            ...userFilters,
            [event.target.name]: event.target.value
        };

        setUserFilters(filters);
        loadUsers(filters, userSort);
    };

    const handleStoreFilter = (event) => {
        const filters = {
            ...storeFilters,
            [event.target.name]: event.target.value
        };

        setStoreFilters(filters);
        loadStores(filters, storeSort);
    };

    const toggleUserSort = (field) => {
        const updatedSort = {
            sortBy: field,
            order:
                userSort.sortBy === field &&
                userSort.order === "asc"
                    ? "desc"
                    : "asc"
        };

        setUserSort(updatedSort);
        loadUsers(userFilters, updatedSort);
    };

    const toggleStoreSort = (field) => {
        const updatedSort = {
            sortBy: field,
            order:
                storeSort.sortBy === field &&
                storeSort.order === "asc"
                    ? "desc"
                    : "asc"
        };

        setStoreSort(updatedSort);
        loadStores(storeFilters, updatedSort);
    };

    const resetUserFilters = () => {
        const filters = {
            name: "",
            email: "",
            address: "",
            role: ""
        };

        setUserFilters(filters);
        loadUsers(filters, userSort);
    };

    const resetStoreFilters = () => {
        const filters = {
            name: "",
            email: "",
            address: ""
        };

        setStoreFilters(filters);
        loadStores(filters, storeSort);
    };

    const openUserForm = () => {
        setError("");

        setUserForm({
            name: "",
            email: "",
            address: "",
            password: "",
            role: "user"
        });

        setShowUserForm(true);
    };

    const openStoreForm = async () => {
        setError("");

        setStoreForm({
            name: "",
            email: "",
            address: "",
            owner_id: ""
        });

        await loadOwners();
        setShowStoreForm(true);
    };

    const handleUserFormChange = (event) => {
        setUserForm({
            ...userForm,
            [event.target.name]: event.target.value
        });
    };

    const handleStoreFormChange = (event) => {
        const { name, value } = event.target;

        setStoreForm({
            ...storeForm,
            [name]:
                name === "owner_id"
                    ? value === ""
                        ? ""
                        : Number(value)
                    : value
        });
    };

    const addUser = async (event) => {
        event.preventDefault();

        setError("");
        setSaving(true);

        try {
            await api.post("/admin/users", {
                name: userForm.name.trim(),
                email: userForm.email.trim(),
                address: userForm.address.trim(),
                password: userForm.password,
                role: userForm.role
            });

            setShowUserForm(false);

            setUserForm({
                name: "",
                email: "",
                address: "",
                password: "",
                role: "user"
            });

            await Promise.all([
                loadStats(),
                loadUsers(),
                loadOwners()
            ]);

            showSuccessMessage(
                "User added successfully"
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to add user"
            );
        } finally {
            setSaving(false);
        }
    };

    const addStore = async (event) => {
        event.preventDefault();

        setError("");

        const ownerId = Number(storeForm.owner_id);

        if (
            !Number.isInteger(ownerId) ||
            ownerId <= 0
        ) {
            setError(
                "Please select a valid store owner"
            );
            return;
        }

        setSaving(true);

        try {
            await api.post("/admin/stores", {
                name: storeForm.name.trim(),
                email: storeForm.email.trim(),
                address: storeForm.address.trim(),
                owner_id: ownerId
            });

            setShowStoreForm(false);

            setStoreForm({
                name: "",
                email: "",
                address: "",
                owner_id: ""
            });

            await Promise.all([
                loadStats(),
                loadStores(),
                loadOwners()
            ]);

            showSuccessMessage(
                "Store added successfully"
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to add store"
            );
        } finally {
            setSaving(false);
        }
    };

    const viewUserDetails = async (user) => {
        try {
            setDetailsLoading(true);
            setSelectedUser(null);
            setShowUserDetails(true);
            setError("");

            const response = await api.get(
                `/admin/users/${user.id}`
            );

            setSelectedUser(response.data);
        } catch (error) {
            setShowUserDetails(false);

            setError(
                error.response?.data?.message ||
                    "Unable to load user details"
            );
        } finally {
            setDetailsLoading(false);
        }
    };

    const viewStoreRatings = async (store) => {
        try {
            setRatingsLoading(true);
            setSelectedStore(store);
            setStoreRatings([]);
            setShowRatings(true);
            setError("");

            const response = await api.get(
                `/admin/stores/${store.id}/ratings`
            );

            setStoreRatings(
                response.data.ratings || []
            );
        } catch (error) {
            setShowRatings(false);

            setError(
                error.response?.data?.message ||
                    "Unable to load ratings"
            );
        } finally {
            setRatingsLoading(false);
        }
    };

    const openUserDeleteModal = (user) => {
        const currentUser = JSON.parse(
            localStorage.getItem("user") || "null"
        );

        if (
            currentUser &&
            Number(currentUser.id) === Number(user.id)
        ) {
            setError(
                "You cannot delete your own admin account"
            );
            return;
        }

        setError("");
        setMessage("");
        setUserToDelete(user);
        setShowDeleteUser(true);
    };

    const openStoreDeleteModal = (store) => {
        setError("");
        setMessage("");
        setStoreToDelete(store);
        setShowDeleteStore(true);
    };

    const deleteUser = async () => {
        if (!userToDelete) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            const response = await api.delete(
                `/admin/users/${userToDelete.id}`
            );

            const deletedStores = Number(
                response.data?.deletedStores || 0
            );

            const deletedRatings = Number(
                response.data?.deletedRatings || 0
            );

            setShowDeleteUser(false);
            setUserToDelete(null);

            await Promise.all([
                loadStats(),
                loadUsers(),
                loadOwners(),
                loadStores()
            ]);

            let successText =
                "User deleted successfully";

            if (deletedStores > 0) {
                successText += ` · ${deletedStores} store(s) removed`;
            }

            if (deletedRatings > 0) {
                successText += ` · ${deletedRatings} rating(s) removed`;
            }

            showSuccessMessage(successText);
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to delete user"
            );
        } finally {
            setDeleting(false);
        }
    };

    const deleteStore = async () => {
        if (!storeToDelete) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            await api.delete(
                `/admin/stores/${storeToDelete.id}`
            );

            setShowDeleteStore(false);
            setStoreToDelete(null);

            await Promise.all([
                loadStats(),
                loadStores(),
                loadOwners()
            ]);

            showSuccessMessage(
                "Store deleted successfully"
            );
        } catch (error) {
            setError(
                error.response?.data?.message ||
                    "Unable to delete store"
            );
        } finally {
            setDeleting(false);
        }
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        navigate("/");
    };

    if (loading) {
        return (
            <div className="admin-loading-page">
                <div className="admin-loading-card">
                    <div className="loading-spinner">
                        <RefreshCw size={21} />
                    </div>

                    <h2>
                        Loading Administration
                    </h2>

                    <p>
                        Preparing your workspace...
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-layout">
            <aside className="admin-sidebar">
                <div className="admin-brand">
                    <div className="brand-mark">
                        <span>R</span>
                    </div>

                    <div>
                        <h2>RATEORA</h2>
                        <span>
                            Administration
                        </span>
                    </div>
                </div>

                <div className="sidebar-section">
                    <span className="sidebar-heading">
                        WORKSPACE
                    </span>

                    <button
                        className={`sidebar-item ${
                            activeSection === "overview"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            changeSection("overview")
                        }
                    >
                        <LayoutDashboard size={17} />
                        <span>Overview</span>
                    </button>

                    <button
                        className={`sidebar-item ${
                            activeSection === "users"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            changeSection("users")
                        }
                    >
                        <Users size={17} />
                        <span>Users</span>
                    </button>

                    <button
                        className={`sidebar-item ${
                            activeSection === "stores"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            changeSection("stores")
                        }
                    >
                        <Store size={17} />
                        <span>Stores</span>
                    </button>
                </div>

                <div className="sidebar-bottom">
                    <div className="admin-profile">
                        <div className="admin-avatar">
                            AD
                        </div>

                        <div>
                            <strong>
                                Administrator
                            </strong>

                            <span>
                                System Admin
                            </span>
                        </div>
                    </div>

                    <button
                        className="logout-button"
                        onClick={logout}
                    >
                        <LogOut size={17} />
                        <span>Logout</span>
                    </button>
                </div>
            </aside>

            <main className="admin-main">
                <header className="admin-topbar">
                    <div>
                        <span className="topbar-label">
                            RATEORA / ADMIN
                        </span>

                        <h1>
                            {activeSection === "overview"
                                ? "Overview"
                                : activeSection === "users"
                                ? "Users"
                                : "Stores"}
                        </h1>
                    </div>
                </header>

                <div className="admin-content">
                    {message && (
                        <div className="admin-alert success">
                            <Activity size={16} />

                            <span>
                                {message}
                            </span>

                            <button
                                onClick={() =>
                                    setMessage("")
                                }
                            >
                                <X size={15} />
                            </button>
                        </div>
                    )}

                    {error && (
                        <div className="admin-alert error">
                            <AlertTriangle size={16} />

                            <span>
                                {error}
                            </span>

                            <button
                                onClick={() =>
                                    setError("")
                                }
                            >
                                <X size={15} />
                            </button>
                        </div>
                    )}

                    {activeSection === "overview" && (
                        <section className="dashboard-section overview-page">
                            <div className="overview-header">
                                <div>
                                    <span className="section-kicker">
                                        RATEORA ADMINISTRATION
                                    </span>

                                    <h2>
                                        Everything under
                                        control.
                                    </h2>

                                    <p>
                                        Manage the people,
                                        stores and customer
                                        feedback that power
                                        the RATEORA platform.
                                    </p>
                                </div>

                                <div className="overview-brand-mark">
                                    R
                                </div>
                            </div>

                            <div className="stats-grid">
                                <button
                                    className="stat-card"
                                    onClick={() =>
                                        changeSection(
                                            "users"
                                        )
                                    }
                                >
                                    <div className="stat-card-top">
                                        <div className="stat-icon">
                                            <Users size={20} />
                                        </div>

                                        <ChevronRight
                                            size={16}
                                        />
                                    </div>

                                    <div className="stat-card-content">
                                        <span>
                                            REGISTERED USERS
                                        </span>

                                        <strong>
                                            {
                                                stats.totalUsers
                                            }
                                        </strong>

                                        <small>
                                            Accounts on the
                                            platform
                                        </small>
                                    </div>
                                </button>

                                <button
                                    className="stat-card"
                                    onClick={() =>
                                        changeSection(
                                            "stores"
                                        )
                                    }
                                >
                                    <div className="stat-card-top">
                                        <div className="stat-icon">
                                            <Store size={20} />
                                        </div>

                                        <ChevronRight
                                            size={16}
                                        />
                                    </div>

                                    <div className="stat-card-content">
                                        <span>
                                            ACTIVE STORES
                                        </span>

                                        <strong>
                                            {
                                                stats.totalStores
                                            }
                                        </strong>

                                        <small>
                                            Stores managed
                                            through RATEORA
                                        </small>
                                    </div>
                                </button>

                                <div className="stat-card">
                                    <div className="stat-card-top">
                                        <div className="stat-icon">
                                            <Star size={20} />
                                        </div>
                                    </div>

                                    <div className="stat-card-content">
                                        <span>
                                            CUSTOMER RATINGS
                                        </span>

                                        <strong>
                                            {
                                                stats.totalRatings
                                            }
                                        </strong>

                                        <small>
                                            Submitted customer
                                            feedback
                                        </small>
                                    </div>
                                </div>

                                <div className="stat-card">
                                    <div className="stat-card-top">
                                        <div className="stat-icon">
                                            <UserRound
                                                size={20}
                                            />
                                        </div>
                                    </div>

                                    <div className="stat-card-content">
                                        <span>
                                            STORE OWNERS
                                        </span>

                                        <strong>
                                            {
                                                stats.totalOwners
                                            }
                                        </strong>

                                        <small>
                                            Owners connected
                                            to stores
                                        </small>
                                    </div>
                                </div>
                            </div>

                            <div className="overview-main-grid">
                                <div className="overview-panel platform-panel">
                                    <div className="panel-heading">
                                        <div>
                                            <span>
                                                PLATFORM
                                                SNAPSHOT
                                            </span>

                                            <h3>
                                                How RATEORA
                                                is organized
                                            </h3>
                                        </div>

                                        <div className="panel-number">
                                            01
                                        </div>
                                    </div>

                                    <div className="platform-flow">
                                        <div className="flow-item">
                                            <div className="flow-number">
                                                01
                                            </div>

                                            <div>
                                                <strong>
                                                    Users
                                                </strong>

                                                <p>
                                                    Customers
                                                    create
                                                    accounts
                                                    and interact
                                                    with stores.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flow-line" />

                                        <div className="flow-item">
                                            <div className="flow-number">
                                                02
                                            </div>

                                            <div>
                                                <strong>
                                                    Stores
                                                </strong>

                                                <p>
                                                    Stores are
                                                    created by
                                                    Admin and
                                                    assigned to
                                                    owners.
                                                </p>
                                            </div>
                                        </div>

                                        <div className="flow-line" />

                                        <div className="flow-item">
                                            <div className="flow-number">
                                                03
                                            </div>

                                            <div>
                                                <strong>
                                                    Ratings
                                                </strong>

                                                <p>
                                                    Customer
                                                    feedback
                                                    creates
                                                    measurable
                                                    store
                                                    performance.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="overview-panel actions-panel">
                                    <div className="panel-heading">
                                        <div>
                                            <span>
                                                ADMIN ACTIONS
                                            </span>

                                            <h3>
                                                Manage your
                                                platform
                                            </h3>
                                        </div>

                                        <ShieldCheck
                                            size={19}
                                        />
                                    </div>

                                    <button
                                        className="overview-action"
                                        onClick={
                                            openUserForm
                                        }
                                    >
                                        <div className="action-icon">
                                            <UserPlus
                                                size={17}
                                            />
                                        </div>

                                        <div>
                                            <strong>
                                                Add User
                                            </strong>

                                            <span>
                                                Create a new
                                                platform
                                                account
                                            </span>
                                        </div>

                                        <ChevronRight
                                            size={16}
                                        />
                                    </button>

                                    <button
                                        className="overview-action"
                                        onClick={
                                            openStoreForm
                                        }
                                    >
                                        <div className="action-icon">
                                            <Store
                                                size={17}
                                            />
                                        </div>

                                        <div>
                                            <strong>
                                                Add Store
                                            </strong>

                                            <span>
                                                Create a store
                                                and assign
                                                owner
                                            </span>
                                        </div>

                                        <ChevronRight
                                            size={16}
                                        />
                                    </button>

                                    <button
                                        className="overview-action"
                                        onClick={() =>
                                            changeSection(
                                                "users"
                                            )
                                        }
                                    >
                                        <div className="action-icon">
                                            <Users
                                                size={17}
                                            />
                                        </div>

                                        <div>
                                            <strong>
                                                Manage Users
                                            </strong>

                                            <span>
                                                Search, review
                                                and delete
                                                users
                                            </span>
                                        </div>

                                        <ChevronRight
                                            size={16}
                                        />
                                    </button>

                                    <button
                                        className="overview-action"
                                        onClick={() =>
                                            changeSection(
                                                "stores"
                                            )
                                        }
                                    >
                                        <div className="action-icon">
                                            <Star
                                                size={17}
                                            />
                                        </div>

                                        <div>
                                            <strong>
                                                Manage Stores
                                            </strong>

                                            <span>
                                                Review stores
                                                and customer
                                                ratings
                                            </span>
                                        </div>

                                        <ChevronRight
                                            size={16}
                                        />
                                    </button>
                                </div>
                            </div>

                            <div className="overview-info-grid">
                                <div className="info-block">
                                    <div className="info-block-icon">
                                        <ShieldCheck
                                            size={19}
                                        />
                                    </div>

                                    <div>
                                        <span>
                                            ADMIN ACCESS
                                        </span>

                                        <h3>
                                            Full platform
                                            control
                                        </h3>

                                        <p>
                                            Administrators
                                            can create and
                                            manage users,
                                            store owners and
                                            stores while
                                            maintaining
                                            oversight of
                                            customer
                                            ratings.
                                        </p>
                                    </div>
                                </div>

                                <div className="info-block">
                                    <div className="info-block-icon">
                                        <Activity
                                            size={19}
                                        />
                                    </div>

                                    <div>
                                        <span>
                                            RATING SYSTEM
                                        </span>

                                        <h3>
                                            Customer
                                            feedback at the
                                            center
                                        </h3>

                                        <p>
                                            Ratings connect
                                            customers with
                                            stores and
                                            provide a clear
                                            view of customer
                                            experience across
                                            the platform.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "users" && (
                        <section className="dashboard-section">
                            <div className="page-heading">
                                <div>
                                    <span className="section-kicker">
                                        USER MANAGEMENT
                                    </span>

                                    <h2>
                                        Platform users
                                    </h2>

                                    <p>
                                        Manage normal users,
                                        administrators and
                                        store owners.
                                    </p>
                                </div>

                                <button
                                    className="heading-action"
                                    onClick={
                                        openUserForm
                                    }
                                >
                                    <UserPlus size={17} />
                                    Add User
                                </button>
                            </div>

                            <div className="filter-panel">
                                <div className="filter-search">
                                    <Search size={16} />

                                    <input
                                        name="name"
                                        value={
                                            userFilters.name
                                        }
                                        onChange={
                                            handleUserFilter
                                        }
                                        placeholder="Search by name"
                                    />
                                </div>

                                <div className="filter-search">
                                    <Mail size={16} />

                                    <input
                                        name="email"
                                        value={
                                            userFilters.email
                                        }
                                        onChange={
                                            handleUserFilter
                                        }
                                        placeholder="Search by email"
                                    />
                                </div>

                                <div className="filter-search">
                                    <MapPin size={16} />

                                    <input
                                        name="address"
                                        value={
                                            userFilters.address
                                        }
                                        onChange={
                                            handleUserFilter
                                        }
                                        placeholder="Search by address"
                                    />
                                </div>

                                <select
                                    name="role"
                                    value={
                                        userFilters.role
                                    }
                                    onChange={
                                        handleUserFilter
                                    }
                                >
                                    <option value="">
                                        All Roles
                                    </option>

                                    <option value="user">
                                        Normal User
                                    </option>

                                    <option value="store_owner">
                                        Store Owner
                                    </option>

                                    <option value="admin">
                                        Admin
                                    </option>
                                </select>

                                <button
                                    className="reset-filter"
                                    onClick={
                                        resetUserFilters
                                    }
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="data-card">
                                <div className="table-top">
                                    <div>
                                        <strong>
                                            User directory
                                        </strong>

                                        <span>
                                            {users.length}{" "}
                                            records
                                        </span>
                                    </div>
                                </div>

                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <button
                                                        onClick={() =>
                                                            toggleUserSort(
                                                                "name"
                                                            )
                                                        }
                                                    >
                                                        User
                                                        <ArrowUpDown
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    </button>
                                                </th>

                                                <th>
                                                    <button
                                                        onClick={() =>
                                                            toggleUserSort(
                                                                "email"
                                                            )
                                                        }
                                                    >
                                                        Email
                                                        <ArrowUpDown
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    </button>
                                                </th>

                                                <th>
                                                    Address
                                                </th>

                                                <th>
                                                    <button
                                                        onClick={() =>
                                                            toggleUserSort(
                                                                "role"
                                                            )
                                                        }
                                                    >
                                                        Role
                                                        <ArrowUpDown
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    </button>
                                                </th>

                                                <th>
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {usersLoading ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="table-state"
                                                    >
                                                        Loading
                                                        users...
                                                    </td>
                                                </tr>
                                            ) : users.length ===
                                              0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="table-state"
                                                    >
                                                        No users
                                                        found
                                                    </td>
                                                </tr>
                                            ) : (
                                                users.map(
                                                    (
                                                        user
                                                    ) => (
                                                        <tr
                                                            key={
                                                                user.id
                                                            }
                                                        >
                                                            <td>
                                                                <div className="user-cell">
                                                                    <div className="table-avatar">
                                                                        {getInitials(
                                                                            user.name
                                                                        )}
                                                                    </div>

                                                                    <strong>
                                                                        {
                                                                            user.name
                                                                        }
                                                                    </strong>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                {
                                                                    user.email
                                                                }
                                                            </td>

                                                            <td className="address-cell">
                                                                {
                                                                    user.address
                                                                }
                                                            </td>

                                                            <td>
                                                                <span
                                                                    className={`role-badge ${user.role}`}
                                                                >
                                                                    {getRoleLabel(
                                                                        user.role
                                                                    )}
                                                                </span>
                                                            </td>

                                                            <td>
                                                                <div className="row-actions">
                                                                    <button
                                                                        className="icon-button view-action"
                                                                        onClick={() =>
                                                                            viewUserDetails(
                                                                                user
                                                                            )
                                                                        }
                                                                        title="View details"
                                                                    >
                                                                        <Eye
                                                                            size={
                                                                                15
                                                                            }
                                                                        />
                                                                    </button>

                                                                    <button
                                                                        className="icon-button delete-action"
                                                                        onClick={() =>
                                                                            openUserDeleteModal(
                                                                                user
                                                                            )
                                                                        }
                                                                        title="Delete user"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                15
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}

                    {activeSection === "stores" && (
                        <section className="dashboard-section">
                            <div className="page-heading">
                                <div>
                                    <span className="section-kicker">
                                        STORE MANAGEMENT
                                    </span>

                                    <h2>
                                        Platform stores
                                    </h2>

                                    <p>
                                        Create stores, assign
                                        owners and monitor
                                        customer ratings.
                                    </p>
                                </div>

                                <button
                                    className="heading-action"
                                    onClick={
                                        openStoreForm
                                    }
                                >
                                    <Plus size={17} />
                                    Add Store
                                </button>
                            </div>

                            <div className="filter-panel store-filter-panel">
                                <div className="filter-search">
                                    <Search size={16} />

                                    <input
                                        name="name"
                                        value={
                                            storeFilters.name
                                        }
                                        onChange={
                                            handleStoreFilter
                                        }
                                        placeholder="Search by store name"
                                    />
                                </div>

                                <div className="filter-search">
                                    <Mail size={16} />

                                    <input
                                        name="email"
                                        value={
                                            storeFilters.email
                                        }
                                        onChange={
                                            handleStoreFilter
                                        }
                                        placeholder="Search by email"
                                    />
                                </div>

                                <div className="filter-search">
                                    <MapPin size={16} />

                                    <input
                                        name="address"
                                        value={
                                            storeFilters.address
                                        }
                                        onChange={
                                            handleStoreFilter
                                        }
                                        placeholder="Search by address"
                                    />
                                </div>

                                <button
                                    className="reset-filter"
                                    onClick={
                                        resetStoreFilters
                                    }
                                >
                                    Reset
                                </button>
                            </div>

                            <div className="data-card">
                                <div className="table-top">
                                    <div>
                                        <strong>
                                            Store directory
                                        </strong>

                                        <span>
                                            {stores.length}{" "}
                                            records
                                        </span>
                                    </div>
                                </div>

                                <div className="table-wrapper">
                                    <table>
                                        <thead>
                                            <tr>
                                                <th>
                                                    <button
                                                        onClick={() =>
                                                            toggleStoreSort(
                                                                "name"
                                                            )
                                                        }
                                                    >
                                                        Store
                                                        <ArrowUpDown
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    </button>
                                                </th>

                                                <th>
                                                    Email
                                                </th>

                                                <th>
                                                    Address
                                                </th>

                                                <th>
                                                    <button
                                                        onClick={() =>
                                                            toggleStoreSort(
                                                                "rating"
                                                            )
                                                        }
                                                    >
                                                        Rating
                                                        <ArrowUpDown
                                                            size={
                                                                13
                                                            }
                                                        />
                                                    </button>
                                                </th>

                                                <th>
                                                    Actions
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {storesLoading ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="table-state"
                                                    >
                                                        Loading
                                                        stores...
                                                    </td>
                                                </tr>
                                            ) : stores.length ===
                                              0 ? (
                                                <tr>
                                                    <td
                                                        colSpan="5"
                                                        className="table-state"
                                                    >
                                                        No stores
                                                        found
                                                    </td>
                                                </tr>
                                            ) : (
                                                stores.map(
                                                    (
                                                        store
                                                    ) => (
                                                        <tr
                                                            key={
                                                                store.id
                                                            }
                                                        >
                                                            <td>
                                                                <div className="store-cell">
                                                                    <div className="store-avatar">
                                                                        <Store
                                                                            size={
                                                                                16
                                                                            }
                                                                        />
                                                                    </div>

                                                                    <strong>
                                                                        {
                                                                            store.name
                                                                        }
                                                                    </strong>
                                                                </div>
                                                            </td>

                                                            <td>
                                                                {
                                                                    store.email
                                                                }
                                                            </td>

                                                            <td className="address-cell">
                                                                {
                                                                    store.address
                                                                }
                                                            </td>

                                                            <td>
                                                                <div className="rating-value">
                                                                    <Star
                                                                        size={
                                                                            14
                                                                        }
                                                                        fill="currentColor"
                                                                    />

                                                                    {Number(
                                                                        store.rating ||
                                                                            0
                                                                    ).toFixed(
                                                                        1
                                                                    )}
                                                                </div>
                                                            </td>

                                                            <td>
                                                                <div className="row-actions">
                                                                    <button
                                                                        className="ratings-button"
                                                                        onClick={() =>
                                                                            viewStoreRatings(
                                                                                store
                                                                            )
                                                                        }
                                                                    >
                                                                        <Star
                                                                            size={
                                                                                14
                                                                            }
                                                                        />

                                                                        Ratings
                                                                    </button>

                                                                    <button
                                                                        className="icon-button delete-action"
                                                                        onClick={() =>
                                                                            openStoreDeleteModal(
                                                                                store
                                                                            )
                                                                        }
                                                                        title="Delete store"
                                                                    >
                                                                        <Trash2
                                                                            size={
                                                                                15
                                                                            }
                                                                        />
                                                                    </button>
                                                                </div>
                                                            </td>
                                                        </tr>
                                                    )
                                                )
                                            )}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </section>
                    )}
                </div>

                <footer className="admin-footer">
                    <span>
                        © 2026 RATEORA
                    </span>

                    <span>
                        Administration Console
                    </span>
                </footer>
            </main>

            {showUserForm && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        !saving &&
                        setShowUserForm(false)
                    }
                >
                    <div
                        className="admin-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <span>
                                    USER MANAGEMENT
                                </span>

                                <h2>
                                    Add new user
                                </h2>

                                <p>
                                    Create a platform
                                    account.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowUserForm(false)
                                }
                                disabled={saving}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={addUser}>
                            <div className="form-grid">
                                <div className="form-field full">
                                    <label>
                                        Full Name
                                    </label>

                                    <input
                                        name="name"
                                        value={
                                            userForm.name
                                        }
                                        onChange={
                                            handleUserFormChange
                                        }
                                        minLength="20"
                                        maxLength="60"
                                        required
                                        placeholder="Enter full name"
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            userForm.email
                                        }
                                        onChange={
                                            handleUserFormChange
                                        }
                                        required
                                        placeholder="name@example.com"
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        Role
                                    </label>

                                    <select
                                        name="role"
                                        value={
                                            userForm.role
                                        }
                                        onChange={
                                            handleUserFormChange
                                        }
                                    >
                                        <option value="user">
                                            Normal User
                                        </option>

                                        <option value="store_owner">
                                            Store Owner
                                        </option>

                                        <option value="admin">
                                            Admin
                                        </option>
                                    </select>
                                </div>

                                <div className="form-field full">
                                    <label>
                                        Address
                                    </label>

                                    <textarea
                                        name="address"
                                        value={
                                            userForm.address
                                        }
                                        onChange={
                                            handleUserFormChange
                                        }
                                        maxLength="400"
                                        required
                                        rows="3"
                                        placeholder="Enter address"
                                    />
                                </div>

                                <div className="form-field full">
                                    <label>
                                        Password
                                    </label>

                                    <input
                                        type="password"
                                        name="password"
                                        value={
                                            userForm.password
                                        }
                                        onChange={
                                            handleUserFormChange
                                        }
                                        minLength="8"
                                        maxLength="16"
                                        required
                                        placeholder="8-16 characters, uppercase + special character"
                                    />
                                </div>
                            </div>

                            <button
                                className="modal-submit"
                                type="submit"
                                disabled={saving}
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw
                                            size={15}
                                            className="spin"
                                        />

                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <UserPlus
                                            size={15}
                                        />

                                        Create User
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showStoreForm && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        !saving &&
                        setShowStoreForm(false)
                    }
                >
                    <div
                        className="admin-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <span>
                                    STORE MANAGEMENT
                                </span>

                                <h2>
                                    Add new store
                                </h2>

                                <p>
                                    Create a store and
                                    assign its owner.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowStoreForm(false)
                                }
                                disabled={saving}
                            >
                                <X size={18} />
                            </button>
                        </div>

                        <form onSubmit={addStore}>
                            <div className="form-grid">
                                <div className="form-field full">
                                    <label>
                                        Store Name
                                    </label>

                                    <input
                                        name="name"
                                        value={
                                            storeForm.name
                                        }
                                        onChange={
                                            handleStoreFormChange
                                        }
                                        minLength="20"
                                        maxLength="60"
                                        required
                                        placeholder="Enter store name"
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        Store Email
                                    </label>

                                    <input
                                        type="email"
                                        name="email"
                                        value={
                                            storeForm.email
                                        }
                                        onChange={
                                            handleStoreFormChange
                                        }
                                        required
                                        placeholder="store@example.com"
                                    />
                                </div>

                                <div className="form-field">
                                    <label>
                                        Store Owner
                                    </label>

                                    <select
                                        name="owner_id"
                                        value={
                                            storeForm.owner_id
                                        }
                                        onChange={
                                            handleStoreFormChange
                                        }
                                        required
                                    >
                                        <option value="">
                                            Select Store Owner
                                        </option>

                                        {owners.map(
                                            (owner) => (
                                                <option
                                                    key={
                                                        owner.id
                                                    }
                                                    value={
                                                        owner.id
                                                    }
                                                >
                                                    {owner.name}{" "}
                                                    —{" "}
                                                    {
                                                        owner.email
                                                    }
                                                </option>
                                            )
                                        )}
                                    </select>

                                    {owners.length === 0 && (
                                        <small className="form-hint">
                                            No Store Owners available. Create a Store Owner first, then reopen this form.
                                        </small>
                                    )}
                                </div>

                                <div className="form-field full">
                                    <label>
                                        Store Address
                                    </label>

                                    <textarea
                                        name="address"
                                        value={
                                            storeForm.address
                                        }
                                        onChange={
                                            handleStoreFormChange
                                        }
                                        maxLength="400"
                                        required
                                        rows="3"
                                        placeholder="Enter store address"
                                    />
                                </div>
                            </div>

                            <button
                                className="modal-submit"
                                type="submit"
                                disabled={
                                    saving ||
                                    owners.length === 0
                                }
                            >
                                {saving ? (
                                    <>
                                        <RefreshCw
                                            size={15}
                                            className="spin"
                                        />

                                        Creating...
                                    </>
                                ) : (
                                    <>
                                        <Plus size={15} />

                                        Create Store
                                    </>
                                )}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {showUserDetails && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowUserDetails(false)
                    }
                >
                    <div
                        className="admin-modal details-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <span>
                                    USER DETAILS
                                </span>

                                <h2>
                                    Account information
                                </h2>
                            </div>

                            <button
                                onClick={() =>
                                    setShowUserDetails(
                                        false
                                    )
                                }
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {detailsLoading ? (
                            <div className="modal-state">
                                Loading details...
                            </div>
                        ) : selectedUser ? (
                            <>
                                <div className="details-profile">
                                    <div className="large-avatar">
                                        {getInitials(
                                            selectedUser.name
                                        )}
                                    </div>

                                    <div>
                                        <h3>
                                            {
                                                selectedUser.name
                                            }
                                        </h3>

                                        <span
                                            className={`role-badge ${selectedUser.role}`}
                                        >
                                            {getRoleLabel(
                                                selectedUser.role
                                            )}
                                        </span>
                                    </div>
                                </div>

                                <div className="details-grid">
                                    <div>
                                        <span>
                                            Email
                                        </span>

                                        <strong>
                                            {
                                                selectedUser.email
                                            }
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Role
                                        </span>

                                        <strong>
                                            {getRoleLabel(
                                                selectedUser.role
                                            )}
                                        </strong>
                                    </div>

                                    <div className="full">
                                        <span>
                                            Address
                                        </span>

                                        <strong>
                                            {
                                                selectedUser.address
                                            }
                                        </strong>
                                    </div>

                                    {selectedUser.role ===
                                        "store_owner" &&
                                        selectedUser.rating !==
                                            undefined && (
                                            <div>
                                                <span>
                                                    Store Rating
                                                </span>

                                                <strong className="detail-rating">
                                                    <Star
                                                        size={
                                                            15
                                                        }
                                                        fill="currentColor"
                                                    />

                                                    {Number(
                                                        selectedUser.rating ||
                                                            0
                                                    ).toFixed(
                                                        1
                                                    )}
                                                </strong>
                                            </div>
                                        )}
                                </div>
                            </>
                        ) : (
                            <div className="modal-state">
                                User details unavailable.
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showRatings && (
                <div
                    className="modal-overlay"
                    onClick={() =>
                        setShowRatings(false)
                    }
                >
                    <div
                        className="admin-modal ratings-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="modal-header">
                            <div>
                                <span>
                                    RATING MANAGEMENT
                                </span>

                                <h2>
                                    {selectedStore?.name}
                                </h2>

                                <p>
                                    Customer ratings for
                                    this store.
                                </p>
                            </div>

                            <button
                                onClick={() =>
                                    setShowRatings(false)
                                }
                            >
                                <X size={18} />
                            </button>
                        </div>

                        {ratingsLoading ? (
                            <div className="modal-state">
                                Loading ratings...
                            </div>
                        ) : storeRatings.length === 0 ? (
                            <div className="modal-state">
                                No ratings have been
                                submitted for this store
                                yet.
                            </div>
                        ) : (
                            <div className="ratings-list">
                                {storeRatings.map(
                                    (rating) => (
                                        <div
                                            className="rating-row"
                                            key={rating.id}
                                        >
                                            <div className="rating-avatar">
                                                {getInitials(
                                                    rating.userName
                                                )}
                                            </div>

                                            <div className="rating-user">
                                                <strong>
                                                    {
                                                        rating.userName
                                                    }
                                                </strong>

                                                <span>
                                                    {
                                                        rating.userEmail
                                                    }
                                                </span>
                                            </div>

                                            <div className="rating-score">
                                                <Star
                                                    size={
                                                        15
                                                    }
                                                    fill="currentColor"
                                                />

                                                {
                                                    rating.rating
                                                }
                                            </div>
                                        </div>
                                    )
                                )}
                            </div>
                        )}
                    </div>
                </div>
            )}

            {showDeleteUser && (
                <div
                    className="modal-overlay"
                    onClick={() => {
                        if (!deleting) {
                            setShowDeleteUser(false);
                            setUserToDelete(null);
                        }
                    }}
                >
                    <div
                        className="delete-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="danger-icon">
                            <AlertTriangle size={22} />
                        </div>

                        <span>
                            USER MANAGEMENT
                        </span>

                        <h2>
                            Delete user?
                        </h2>

                        <p>
                            Are you sure you want to
                            delete{" "}
                            <strong>
                                {userToDelete?.name}
                            </strong>
                            ? This action cannot be
                            undone.
                        </p>

                        {userToDelete?.role ===
                            "store_owner" && (
                            <div className="delete-note">
                                This Store Owner's
                                assigned stores and
                                associated ratings will
                                also be removed.
                            </div>
                        )}

                        <div className="modal-actions">
                            <button
                                className="cancel-button"
                                onClick={() => {
                                    setShowDeleteUser(false);
                                    setUserToDelete(null);
                                }}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                className="delete-confirm"
                                onClick={deleteUser}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <>
                                        <RefreshCw
                                            size={14}
                                            className="spin"
                                        />

                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2
                                            size={14}
                                        />

                                        Delete User
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {showDeleteStore && (
                <div
                    className="modal-overlay"
                    onClick={() => {
                        if (!deleting) {
                            setShowDeleteStore(false);
                            setStoreToDelete(null);
                        }
                    }}
                >
                    <div
                        className="delete-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >
                        <div className="danger-icon">
                            <AlertTriangle size={22} />
                        </div>

                        <span>
                            STORE MANAGEMENT
                        </span>

                        <h2>
                            Delete store?
                        </h2>

                        <p>
                            Are you sure you want to
                            delete{" "}
                            <strong>
                                {storeToDelete?.name}
                            </strong>
                            ? All ratings associated with
                            this store will also be
                            removed.
                        </p>

                        <div className="modal-actions">
                            <button
                                className="cancel-button"
                                onClick={() => {
                                    setShowDeleteStore(false);
                                    setStoreToDelete(null);
                                }}
                                disabled={deleting}
                            >
                                Cancel
                            </button>

                            <button
                                className="delete-confirm"
                                onClick={deleteStore}
                                disabled={deleting}
                            >
                                {deleting ? (
                                    <>
                                        <RefreshCw
                                            size={14}
                                            className="spin"
                                        />

                                        Deleting...
                                    </>
                                ) : (
                                    <>
                                        <Trash2
                                            size={14}
                                        />

                                        Delete Store
                                    </>
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default AdminDashboard;