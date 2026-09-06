import { useNavigate } from "react-router-dom";
import {
    ArrowRight,
    BarChart3,
    CheckCircle2,
    ChevronDown,
    Search,
    ShieldCheck,
    Star,
    Store,
    UserRound,
    Users,
    MessageSquare,
    TrendingUp
} from "lucide-react";
import "./LandingPage.css";

function LandingPage() {
    const navigate = useNavigate();

    const scrollToSection = (id) => {
        document.getElementById(id)?.scrollIntoView({
            behavior: "smooth"
        });
    };

    return (
        <div className="landing-page">

            <header className="landing-navbar">
                <div
                    className="landing-brand"
                    onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                >
                    <div className="brand-symbol">
                        <Star size={17} fill="currentColor" />
                    </div>

                    <div className="brand-text">
                        <strong>RATEORA</strong>
                        <span>STORE EXPERIENCE</span>
                    </div>
                </div>

                <nav className="landing-nav-links">
                    <button onClick={() => scrollToSection("about")}>
                        About
                    </button>

                    <button onClick={() => scrollToSection("how-it-works")}>
                        How it works
                    </button>

                    <button onClick={() => scrollToSection("for-businesses")}>
                        For businesses
                    </button>
                </nav>

                <div className="landing-nav-actions">
                    <button
                        className="nav-login"
                        onClick={() => navigate("/login")}
                    >
                        Login
                    </button>

                    <button
                        className="nav-register"
                        onClick={() => navigate("/register")}
                    >
                        Get started
                    </button>
                </div>
            </header>

            <main>

                <section className="landing-hero">

                    <div className="hero-glow hero-glow-one"></div>
                    <div className="hero-glow hero-glow-two"></div>

                    <div className="hero-content">

                        <div className="hero-badge">
                            <span className="badge-dot"></span>
                            A smarter way to share store experiences
                        </div>

                        <h1>
                            Discover stores.
                            <br />
                            <span>Share experiences.</span>
                            <br />
                            Build trust.
                        </h1>

                        <p>
                            RATEORA connects customers with stores through
                            simple, meaningful ratings. Discover businesses,
                            understand customer experiences and help stores
                            improve through genuine feedback.
                        </p>

                        <div className="hero-buttons">
                            <button
                                className="hero-primary"
                                onClick={() => navigate("/register")}
                            >
                                Start rating
                                <ArrowRight size={17} />
                            </button>

                            <button
                                className="hero-secondary"
                                onClick={() => scrollToSection("how-it-works")}
                            >
                                Explore RATEORA
                                <ChevronDown size={16} />
                            </button>
                        </div>

                        <div className="hero-trust-line">
                            <ShieldCheck size={15} />
                            <span>Simple 1–5 ratings • Clear feedback • Better decisions</span>
                        </div>

                    </div>

                    <div className="hero-visual">

                        <div className="floating-orb orb-one"></div>
                        <div className="floating-orb orb-two"></div>

                        <div className="rating-preview-card">

                            <div className="preview-top">
                                <div className="preview-store-icon">
                                    <Store size={20} />
                                </div>

                                <div>
                                    <strong>Store Experience</strong>
                                    <span>Customer feedback</span>
                                </div>

                                <div className="verified-mark">
                                    <CheckCircle2 size={16} />
                                </div>
                            </div>

                            <div className="preview-rating">

                                <div className="rating-number">
                                    <strong>4.6</strong>
                                    <span>out of 5</span>
                                </div>

                                <div className="preview-stars">
                                    {[1, 2, 3, 4, 5].map((star) => (
                                        <Star
                                            key={star}
                                            size={18}
                                            fill="currentColor"
                                        />
                                    ))}
                                </div>

                            </div>

                            <div className="rating-bar-group">
                                <div>
                                    <span>5</span>
                                    <div className="rating-bar">
                                        <i style={{ width: "82%" }}></i>
                                    </div>
                                </div>

                                <div>
                                    <span>4</span>
                                    <div className="rating-bar">
                                        <i style={{ width: "64%" }}></i>
                                    </div>
                                </div>

                                <div>
                                    <span>3</span>
                                    <div className="rating-bar">
                                        <i style={{ width: "28%" }}></i>
                                    </div>
                                </div>
                            </div>

                            <div className="preview-footer">
                                <span>Customer experience</span>
                                <strong>Built from ratings</strong>
                            </div>

                        </div>

                        <div className="floating-review review-one">
                            <div className="mini-avatar">
                                <UserRound size={14} />
                            </div>

                            <div>
                                <strong>Customer feedback</strong>
                                <span>Easy to understand</span>
                            </div>

                            <Star size={14} fill="currentColor" />
                        </div>

                        <div className="floating-review review-two">
                            <div className="mini-icon">
                                <TrendingUp size={15} />
                            </div>

                            <div>
                                <strong>Store insights</strong>
                                <span>Understand your customers</span>
                            </div>
                        </div>

                    </div>

                </section>

                <section className="discover-strip">

                    <div className="discover-content">

                        <div className="discover-icon">
                            <Search size={19} />
                        </div>

                        <div>
                            <span>LOOKING FOR A STORE?</span>
                            <strong>Discover businesses and understand their overall experience.</strong>
                        </div>

                    </div>

                    <button
                        onClick={() => navigate("/register")}
                    >
                        Explore stores
                        <ArrowRight size={15} />
                    </button>

                </section>

                <section
                    id="about"
                    className="landing-section about-section"
                >

                    <div className="section-heading">

                        <span className="section-label">
                            WHY RATEORA
                        </span>

                        <h2>
                            Reviews should help people
                            <br />
                            <span>make better decisions.</span>
                        </h2>

                        <p>
                            RATEORA creates a simple connection between the people
                            who experience a store and the businesses that want
                            to understand that experience.
                        </p>

                    </div>

                    <div className="feature-grid">

                        <article className="feature-card">
                            <div className="feature-icon">
                                <Search size={21} />
                            </div>

                            <span>01</span>

                            <h3>Discover</h3>

                            <p>
                                Find stores by name or address and see their
                                overall customer rating before making a decision.
                            </p>
                        </article>

                        <article className="feature-card featured-feature">
                            <div className="feature-icon">
                                <MessageSquare size={21} />
                            </div>

                            <span>02</span>

                            <h3>Share</h3>

                            <p>
                                Submit a simple 1–5 rating based on your actual
                                experience with a store.
                            </p>
                        </article>

                        <article className="feature-card">
                            <div className="feature-icon">
                                <BarChart3 size={21} />
                            </div>

                            <span>03</span>

                            <h3>Understand</h3>

                            <p>
                                Store owners can use rating activity and overall
                                scores to understand customer perception.
                            </p>
                        </article>

                    </div>

                </section>

                <section
                    id="how-it-works"
                    className="landing-section process-section"
                >

                    <div className="process-intro">

                        <div>
                            <span className="section-label">
                                HOW IT WORKS
                            </span>

                            <h2>
                                From experience
                                <br />
                                <span>to insight.</span>
                            </h2>
                        </div>

                        <p>
                            RATEORA keeps the feedback journey straightforward.
                            Customers share their experience, ratings create a
                            clear signal, and stores get a better understanding
                            of their customer experience.
                        </p>

                    </div>

                    <div className="process-line">

                        <div className="process-step">
                            <div className="step-number">01</div>
                            <div className="step-icon">
                                <Search size={19} />
                            </div>

                            <h3>Find a store</h3>

                            <p>
                                Search stores by name or address.
                            </p>
                        </div>

                        <div className="step-connector"></div>

                        <div className="process-step">
                            <div className="step-number">02</div>
                            <div className="step-icon">
                                <Star size={19} fill="currentColor" />
                            </div>

                            <h3>Rate your experience</h3>

                            <p>
                                Choose a rating from 1 to 5.
                            </p>
                        </div>

                        <div className="step-connector"></div>

                        <div className="process-step">
                            <div className="step-number">03</div>
                            <div className="step-icon">
                                <BarChart3 size={19} />
                            </div>

                            <h3>Build the score</h3>

                            <p>
                                Ratings contribute to the store's overall score.
                            </p>
                        </div>

                        <div className="step-connector"></div>

                        <div className="process-step">
                            <div className="step-number">04</div>
                            <div className="step-icon">
                                <TrendingUp size={19} />
                            </div>

                            <h3>Improve</h3>

                            <p>
                                Businesses use feedback to understand customer perception.
                            </p>
                        </div>

                    </div>

                </section>

                <section className="rating-section">

                    <div className="rating-copy">

                        <span className="section-label">
                            THE RATEORA SCALE
                        </span>

                        <h2>
                            One simple scale.
                            <br />
                            <span>One clear signal.</span>
                        </h2>

                        <p>
                            RATEORA uses a straightforward 1–5 rating system.
                            The overall rating represents the average of submitted
                            customer ratings for a store.
                        </p>

                        <div className="rating-principles">

                            <div>
                                <CheckCircle2 size={17} />
                                <span>Easy for customers to understand</span>
                            </div>

                            <div>
                                <CheckCircle2 size={17} />
                                <span>Clear overall store rating</span>
                            </div>

                            <div>
                                <CheckCircle2 size={17} />
                                <span>Useful feedback for businesses</span>
                            </div>

                        </div>

                    </div>

                    <div className="rating-scale-card">

                        <div className="scale-header">
                            <span>RATING</span>
                            <span>EXPERIENCE</span>
                        </div>

                        <div className="scale-row">
                            <strong>1</strong>
                            <div className="scale-stars">
                                <Star size={15} fill="currentColor" />
                            </div>
                            <span>Poor</span>
                        </div>

                        <div className="scale-row">
                            <strong>2</strong>
                            <div className="scale-stars">
                                <Star size={15} fill="currentColor" />
                                <Star size={15} fill="currentColor" />
                            </div>
                            <span>Fair</span>
                        </div>

                        <div className="scale-row">
                            <strong>3</strong>
                            <div className="scale-stars">
                                {[1, 2, 3].map((item) => (
                                    <Star key={item} size={15} fill="currentColor" />
                                ))}
                            </div>
                            <span>Good</span>
                        </div>

                        <div className="scale-row">
                            <strong>4</strong>
                            <div className="scale-stars">
                                {[1, 2, 3, 4].map((item) => (
                                    <Star key={item} size={15} fill="currentColor" />
                                ))}
                            </div>
                            <span>Very good</span>
                        </div>

                        <div className="scale-row scale-best">
                            <strong>5</strong>
                            <div className="scale-stars">
                                {[1, 2, 3, 4, 5].map((item) => (
                                    <Star key={item} size={15} fill="currentColor" />
                                ))}
                            </div>
                            <span>Excellent</span>
                        </div>

                    </div>

                </section>

                <section
                    id="for-businesses"
                    className="business-section"
                >

                    <div className="business-heading">
                        <span className="section-label">
                            FOR STORE OWNERS
                        </span>

                        <h2>
                            Customer feedback can become
                            <br />
                            <span>your next improvement.</span>
                        </h2>

                        <p>
                            RATEORA gives store owners a focused view of their
                            assigned store and its customer rating activity.
                        </p>
                    </div>

                    <div className="business-grid">

                        <div className="business-card">

                            <div className="business-card-top">
                                <div className="business-icon">
                                    <Store size={21} />
                                </div>

                                <span>STORE OWNER</span>
                            </div>

                            <h3>
                                Understand how customers
                                experience your store.
                            </h3>

                            <p>
                                View your store's average rating and understand
                                how much customer feedback your business is receiving.
                            </p>

                            <div className="business-list">
                                <div>
                                    <CheckCircle2 size={15} />
                                    <span>Store overview</span>
                                </div>

                                <div>
                                    <CheckCircle2 size={15} />
                                    <span>Average customer rating</span>
                                </div>

                                <div>
                                    <CheckCircle2 size={15} />
                                    <span>Customer activity</span>
                                </div>
                            </div>

                            <button
                                onClick={() => navigate("/login")}
                            >
                                Owner login
                                <ArrowRight size={15} />
                            </button>

                        </div>

                        <div className="business-visual">

                            <div className="business-stat">
                                <div className="stat-icon">
                                    <Star size={17} fill="currentColor" />
                                </div>

                                <div>
                                    <span>Average rating</span>
                                    <strong>4.6 / 5</strong>
                                </div>
                            </div>

                            <div className="business-chart">
                                <div className="chart-title">
                                    <span>Customer feedback</span>
                                    <BarChart3 size={17} />
                                </div>

                                <div className="chart-bars">
                                    <i style={{ height: "42%" }}></i>
                                    <i style={{ height: "58%" }}></i>
                                    <i style={{ height: "48%" }}></i>
                                    <i style={{ height: "76%" }}></i>
                                    <i style={{ height: "88%" }}></i>
                                    <i style={{ height: "68%" }}></i>
                                    <i style={{ height: "94%" }}></i>
                                </div>

                                <div className="chart-labels">
                                    <span>Mon</span>
                                    <span>Tue</span>
                                    <span>Wed</span>
                                    <span>Thu</span>
                                    <span>Fri</span>
                                    <span>Sat</span>
                                    <span>Sun</span>
                                </div>
                            </div>

                        </div>

                    </div>

                </section>

                <section className="trust-section">

                    <div className="trust-badge">
                        <ShieldCheck size={20} />
                    </div>

                    <div className="trust-copy">

                        <span className="section-label">
                            TRUST & TRANSPARENCY
                        </span>

                        <h2>
                            Feedback is valuable
                            <br />
                            when it is <span>genuine.</span>
                        </h2>

                        <p>
                            RATEORA is designed around a simple principle:
                            customer ratings should represent real experiences.
                            Clear feedback helps customers make informed choices
                            while giving stores a useful signal about their service.
                        </p>

                    </div>

                    <div className="trust-points">

                        <div>
                            <Users size={18} />
                            <div>
                                <strong>Customer voice</strong>
                                <span>Share your own experience.</span>
                            </div>
                        </div>

                        <div>
                            <ShieldCheck size={18} />
                            <div>
                                <strong>Clear ratings</strong>
                                <span>A simple 1–5 rating system.</span>
                            </div>
                        </div>

                        <div>
                            <TrendingUp size={18} />
                            <div>
                                <strong>Better experiences</strong>
                                <span>Feedback can guide improvement.</span>
                            </div>
                        </div>

                    </div>

                </section>

                <section className="final-cta">

                    <div className="cta-glow"></div>

                    <span className="section-label">
                        YOUR EXPERIENCE MATTERS
                    </span>

                    <h2>
                        Ready to make your
                        <br />
                        <span>experience count?</span>
                    </h2>

                    <p>
                        Join RATEORA and become part of a simpler,
                        more transparent way to understand store experiences.
                    </p>

                    <div className="cta-buttons">

                        <button
                            className="cta-primary"
                            onClick={() => navigate("/register")}
                        >
                            Create your account
                            <ArrowRight size={17} />
                        </button>

                        <button
                            className="cta-secondary"
                            onClick={() => navigate("/login")}
                        >
                            Already have an account?
                            <span>Login</span>
                        </button>

                    </div>

                </section>

            </main>

            <footer className="landing-footer">

                <div className="footer-brand">

                    <div className="landing-brand">
                        <div className="brand-symbol">
                            <Star size={15} fill="currentColor" />
                        </div>

                        <div className="brand-text">
                            <strong>RATEORA</strong>
                            <span>STORE EXPERIENCE</span>
                        </div>
                    </div>

                    <p>
                        A simple platform for discovering stores,
                        sharing experiences and understanding customer feedback.
                    </p>

                </div>

                <div className="footer-links">

                    <div>
                        <span>PLATFORM</span>

                        <button onClick={() => scrollToSection("about")}>
                            About RATEORA
                        </button>

                        <button onClick={() => scrollToSection("how-it-works")}>
                            How it works
                        </button>

                        <button onClick={() => scrollToSection("for-businesses")}>
                            For businesses
                        </button>
                    </div>

                    <div>
                        <span>ACCOUNT</span>

                        <button onClick={() => navigate("/login")}>
                            Login
                        </button>

                        <button onClick={() => navigate("/register")}>
                            Register
                        </button>
                    </div>

                </div>

                <div className="footer-bottom">
                    <span>© 2026 RATEORA. Store Experience Platform.</span>
                    <span>Built around customer feedback.</span>
                </div>

            </footer>

        </div>
    );
}

export default LandingPage;