import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom'; // ضروري للتوجيه
import '../styles/Admin.css';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    // 1. حماية المسار: التأكد من أن المستخدم أدمن
    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        const user = JSON.parse(localStorage.getItem('user')); // تأكد أنك تخزن الـ user في Auth.jsx

        if (!token || user?.role !== 'admin') {
            navigate('/login'); // إذا لم يكن أدمن، أعده لصفحة تسجيل الدخول
        }
    }, [navigate]);

    // 2. جلب البيانات من الـ API
    useEffect(() => {
        const fetchStats = async () => {
            const token = localStorage.getItem('auth_token');
            if (!token) return;

            try {
                const response = await axios.get('http://127.0.0.1:8000/api/admin/stats', {
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                });
                setStats(response.data.data);
                setLoading(false);
            } catch (error) {
                console.error("Erreur lors du chargement des stats:", error);
                // إذا انتهت صلاحية التوكن (401)، يفضل توجيهه للـ login
                if (error.response?.status === 401) {
                    navigate('/login');
                }
                setLoading(false);
            }
        };

        fetchStats();
    }, [navigate]);

   

    return (
        <div className="admin-container">
            {/* Sidebar (نفس اللي درنا قبل) */}
            <aside className="admin-sidebar">
                <div className="admin-logo">HALLA ADMIN</div>
                <nav className="admin-nav">
                    <div className="nav-item active">Tableau de bord</div>
                    <div className="nav-item">Commandes</div>
                    <div className="nav-item">Utilisateurs</div>
                </nav>
            </aside>

            <main className="admin-main">
                <header className="admin-header">
                    <h2>Tableau de Bord</h2>
                    <div className="admin-profile">Admin Mohammed</div>
                </header>

                {/* عرض الإحصائيات الحقيقية */}
                <div className="stats-grid">
                    <div className="stat-card">
                        <span className="stat-icon">💰</span>
                        <div className="stat-info">
                            <h3>{stats?.total_revenue} DH</h3>
                            <p>Revenu Total</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">📦</span>
                        <div className="stat-info">
                            <h3>{stats?.total_orders}</h3>
                            <p>Commandes</p>
                        </div>
                    </div>
                    <div className="stat-card">
                        <span className="stat-icon">👤</span>
                        <div className="stat-info">
                            <h3>{stats?.total_clients}</h3>
                            <p>Clients</p>
                        </div>
                    </div>
                </div>

                {/* جدول الطلبات الأخيرة */}
                <section className="recent-orders">
                    <h3>Dernières Commandes</h3>
                    <table className="admin-table">
                        <thead>
                            <tr>
                                <th>Client</th>
                                <th>Total</th>
                                <th>Statut</th>
                                <th>Date</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stats?.recent_orders.map(order => (
                                <tr key={order.id}>
                                    <td>{order.utilisateur?.nom}</td>
                                    <td>{order.total_price} DH</td>
                                    <td>
                                        <span className={`status ${order.status}`}>
                                            {order.status}
                                        </span>
                                    </td>
                                    <td>{new Date(order.created_at).toLocaleDateString()}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </main>
        </div>
    );
};

export default AdminDashboard;