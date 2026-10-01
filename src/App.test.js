// src/App.test.js
import React from 'react';
import { render, screen, fireEvent, within } from '@testing-library/react';
import '@testing-library/jest-dom';
import App from './App';

// ---------------------------------------------------------------------------
// Test Helpers
// ---------------------------------------------------------------------------

/**
 * Renders the App with a given initial route.
 * Since App already includes BrowserRouter, we just need to set window.history.
 */
const renderApp = (route = '/') => {
  window.history.pushState({}, 'Test page', route);
  return render(<App />);
};

// ---------------------------------------------------------------------------
// App Shell Tests
// ---------------------------------------------------------------------------

describe('App — Shell & Layout', () => {
  test('renders without crashing', () => {
    renderApp();
    expect(document.querySelector('.app')).toBeInTheDocument();
  });

  test('renders the Navbar on every route', () => {
    renderApp();
    const navbar = document.querySelector('.navbar');
    expect(navbar).toBeInTheDocument();
    expect(screen.getByText(/GameHub/i)).toBeInTheDocument();
  });

  test('renders the main content wrapper', () => {
    renderApp();
    expect(document.querySelector('.main-content')).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Navbar Tests
// ---------------------------------------------------------------------------

describe('Navbar', () => {
  test('renders all primary navigation links', () => {
    renderApp();
    const nav = document.querySelector('.navbar-links');
    expect(nav).toBeInTheDocument();

    expect(within(nav).getByText(/Home/i)).toBeInTheDocument();
    expect(within(nav).getByText(/Library/i)).toBeInTheDocument();
    expect(within(nav).getByText(/Store/i)).toBeInTheDocument();
    expect(within(nav).getByText(/Community/i)).toBeInTheDocument();
  });

  test('logo links back to home', () => {
    renderApp();
    const logo = document.querySelector('.navbar-logo');
    expect(logo).toHaveAttribute('href', '/');
  });

  test('shows user avatar when authenticated', () => {
    renderApp();
    // UserContext defaults to authenticated with mockUser
    expect(screen.getByText(/GameMaster42/i)).toBeInTheDocument();
  });

  test('Logout button is present when authenticated', () => {
    renderApp();
    expect(
      screen.getByRole('button', { name: /logout/i })
    ).toBeInTheDocument();
  });

  test('toggles mobile menu when toggle button is clicked', () => {
    renderApp();
    const toggle = document.querySelector('.menu-toggle');
    const links = document.querySelector('.navbar-links');

    expect(toggle).toBeInTheDocument();
    expect(links).not.toHaveClass('active');

    fireEvent.click(toggle);
    expect(links).toHaveClass('active');

    fireEvent.click(toggle);
    expect(links).not.toHaveClass('active');
  });
});

// ---------------------------------------------------------------------------
// Routing Tests
// ---------------------------------------------------------------------------

describe('Routing', () => {
  test('renders Home page on "/"', () => {
    renderApp('/');
    expect(
      screen.getByText(/Level Up Your/i)
    ).toBeInTheDocument();
    expect(screen.getByText(/Gaming Experience/i)).toBeInTheDocument();
  });

  test('renders Game Library on "/library"', () => {
    renderApp('/library');
    expect(screen.getByText(/My Library/i)).toBeInTheDocument();
    expect(screen.getByText(/games in your collection/i)).toBeInTheDocument();
  });

  test('renders Store on "/store"', () => {
    renderApp('/store');
    expect(screen.getByText(/Game Store/i)).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(/Search games/i)
    ).toBeInTheDocument();
  });

  test('renders Community on "/community"', () => {
    renderApp('/community');
    expect(screen.getByText(/^Community$/i)).toBeInTheDocument();
    expect(
      screen.getByText(/Connect with gamers worldwide/i)
    ).toBeInTheDocument();
  });

  test('renders Profile on "/profile"', () => {
    renderApp('/profile');
    expect(screen.getByText(/GameMaster42/i)).toBeInTheDocument();
    expect(screen.getByText(/Level/i)).toBeInTheDocument();
  });

  test('renders GameDetails for a valid game id', () => {
    renderApp('/game/1');
    expect(screen.getByText(/Cyber Odyssey/i)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /buy now|play now/i })
    ).toBeInTheDocument();
  });

  test('renders "not found" fallback for an invalid game id', () => {
    renderApp('/game/9999');
    expect(screen.getByText(/Game not found/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Home Page Tests
// ---------------------------------------------------------------------------

describe('Home Page', () => {
  test('renders the hero heading', () => {
    renderApp('/');
    expect(
      screen.getByRole('heading', { level: 1 })
    ).toBeInTheDocument();
  });

  test('renders hero CTA buttons', () => {
    renderApp('/');
    expect(
      screen.getByRole('link', { name: /Browse Store/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('link', { name: /My Library/i })
    ).toBeInTheDocument();
  });

  test('renders hero stats', () => {
    renderApp('/');
    expect(screen.getByText('10K+')).toBeInTheDocument();
    expect(screen.getByText('5M+')).toBeInTheDocument();
    expect(screen.getByText('24/7')).toBeInTheDocument();
  });

  test('renders Featured Games section', () => {
    renderApp('/');
    expect(
      screen.getByRole('heading', { name: /Featured Games/i })
    ).toBeInTheDocument();
  });

  test('renders Trending Now section', () => {
    renderApp('/');
    expect(
      screen.getByRole('heading', { name: /Trending Now/i })
    ).toBeInTheDocument();
  });

  test('renders the community CTA', () => {
    renderApp('/');
    expect(
      screen.getByRole('heading', { name: /Join the Community/i })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Store Page Tests
// ---------------------------------------------------------------------------

describe('Store Page', () => {
  test('renders game search input', () => {
    renderApp('/store');
    const input = screen.getByPlaceholderText(/Search games/i);
    expect(input).toBeInTheDocument();
    expect(input).toHaveValue('');
  });

  test('search filters games by title', () => {
    renderApp('/store');
    const input = screen.getByPlaceholderText(/Search games/i);

    fireEvent.change(input, { target: { value: 'Cyber' } });
    expect(input).toHaveValue('Cyber');

    expect(screen.getByText(/Cyber Odyssey/i)).toBeInTheDocument();
    expect(screen.queryByText(/Dragon Realm/i)).not.toBeInTheDocument();
  });

  test('search with no matches shows empty state', () => {
    renderApp('/store');
    const input = screen.getByPlaceholderText(/Search games/i);

    fireEvent.change(input, { target: { value: 'zzzzzz' } });
    expect(screen.getByText(/No games found/i)).toBeInTheDocument();
  });

  test('genre filter chip is clickable', () => {
    renderApp('/store');
    const rpgChip = screen.getByRole('button', { name: /^RPG$/i });
    fireEvent.click(rpgChip);
    expect(rpgChip).toHaveClass('active');
  });

  test('platform filter chip is clickable', () => {
    renderApp('/store');
    const pcChip = screen.getByRole('button', { name: /^PC$/i });
    fireEvent.click(pcChip);
    expect(pcChip).toHaveClass('active');
  });

  test('price filter "Free" only shows free games', () => {
    renderApp('/store');
    const freeChip = screen.getByRole('button', { name: /^Free$/i });
    fireEvent.click(freeChip);

    expect(screen.getByText(/Mystic Legends/i)).toBeInTheDocument();
    expect(screen.queryByText(/Cyber Odyssey/i)).not.toBeInTheDocument();
  });

  test('sort dropdown changes the results order', () => {
    renderApp('/store');
    const sort = screen.getByRole('combobox');
    fireEvent.change(sort, { target: { value: 'price-low' } });
    expect(sort).toHaveValue('price-low');
  });
});

// ---------------------------------------------------------------------------
// GameDetails Page Tests
// ---------------------------------------------------------------------------

describe('GameDetails Page', () => {
  test('renders game title, developer and genre', () => {
    renderApp('/game/1');
    expect(screen.getByText(/Cyber Odyssey/i)).toBeInTheDocument();
    expect(screen.getByText(/Neon Studios/i)).toBeInTheDocument();
    expect(screen.getAllByText(/RPG/i).length).toBeGreaterThan(0);
  });

  test('renders Overview / Details / Reviews tabs', () => {
    renderApp('/game/1');
    expect(
      screen.getByRole('button', { name: /Overview/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Details/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /Reviews/i })
    ).toBeInTheDocument();
  });

  test('clicking a tab switches the tab content', () => {
    renderApp('/game/1');

    fireEvent.click(screen.getByRole('button', { name: /Reviews/i }));
    expect(screen.getByText(/Based on 1,234 reviews/i)).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: /Details/i }));
    expect(screen.getByText(/Release Date/i)).toBeInTheDocument();
  });

  test('renders buy button for a paid game', () => {
    renderApp('/game/1');
    expect(
      screen.getByRole('button', { name: /Buy Now/i })
    ).toBeInTheDocument();
  });

  test('renders play button for a free game', () => {
    renderApp('/game/4'); // Mystic Legends — free
    expect(
      screen.getByRole('button', { name: /Play Now/i })
    ).toBeInTheDocument();
  });

  test('renders wishlist button', () => {
    renderApp('/game/1');
    expect(
      screen.getByRole('button', { name: /Add to Wishlist/i })
    ).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Community Page Tests
// ---------------------------------------------------------------------------

describe('Community Page', () => {
  test('renders the three community tabs', () => {
    renderApp('/community');
    expect(screen.getByRole('button', { name: /^Feed$/i })).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Leaderboard$/i })
    ).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: /^Friends$/i })
    ).toBeInTheDocument();
  });

  test('Feed tab shows the post composer', () => {
    renderApp('/community');
    expect(
      screen.getByPlaceholderText(/Share your gaming moments/i)
    ).toBeInTheDocument();
  });

  test('Leaderboard tab shows top players', () => {
    renderApp('/community');
    fireEvent.click(screen.getByRole('button', { name: /^Leaderboard$/i }));
    expect(screen.getByText(/Top Players This Week/i)).toBeInTheDocument();
    expect(screen.getByText(/GameMaster42/i)).toBeInTheDocument();
  });

  test('Friends tab shows the friends grid', () => {
    renderApp('/community');
    fireEvent.click(screen.getByRole('button', { name: /^Friends$/i }));
    expect(screen.getByText(/Your Friends/i)).toBeInTheDocument();
  });
});

// ---------------------------------------------------------------------------
// Profile Page Tests
// ---------------------------------------------------------------------------

describe('Profile Page', () => {
  test('renders user name, level and stats', () => {
    renderApp('/profile');
    expect(screen.getByText(/GameMaster42/i)).toBeInTheDocument();
    expect(screen.getByText(/Level/i)).toBeInTheDocument();
    expect(screen.getByText(/Games Owned/i)).toBeInTheDocument();
    expect(screen.getByText(/Achievements/i)).toBeInTheDocument();
  });

  test('renders XP progress bar', () => {
    renderApp('/profile');
    expect(screen.getByText(/Level Progress/i)).toBeInTheDocument();
    expect(document.querySelector('.xp-bar')).toBeInTheDocument();
    expect(document.querySelector('.xp-fill')).toBeInTheDocument();
  });

  test('renders recent activity list', () => {
    renderApp('/profile');
    expect(screen.getByText(/Recent Activity/i)).toBeInTheDocument();
    expect(screen.getByText(/Cyber Odyssey/i)).toBeInTheDocument();
  });

  test('renders favorite genres tags', () => {
    renderApp('/profile');
    expect(screen.getByText(/Favorite Genres/i)).toBeInTheDocument();
    expect(screen.getAllByText(/RPG/i).length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// GameCard Component Tests
// ---------------------------------------------------------------------------

describe('GameCard', () => {
  test('renders game cards with titles on the Home page', () => {
    renderApp('/');
    const cards = document.querySelectorAll('.game-card');
    expect(cards.length).toBeGreaterThan(0);
  });

  test('game card links to the correct game details route', () => {
    renderApp('/');
    const firstCard = document.querySelector('.game-card');
    expect(firstCard).toHaveAttribute('href', expect.stringMatching(/^\/game\//));
  });

  test('shows discount badge when discount > 0', () => {
    renderApp('/');
    const badges = document.querySelectorAll('.discount-badge');
    expect(badges.length).toBeGreaterThan(0);
  });
});

// ---------------------------------------------------------------------------
// Navigation Flow Tests
// ---------------------------------------------------------------------------

describe('Navigation flow', () => {
  test('clicking "Browse Store" navigates to Store', () => {
    renderApp('/');
    fireEvent.click(screen.getByRole('link', { name: /Browse Store/i }));
    expect(screen.getByText(/Game Store/i)).toBeInTheDocument();
  });

  test('clicking "My Library" navigates to Library', () => {
    renderApp('/');
    fireEvent.click(screen.getByRole('link', { name: /My Library/i }));
    expect(screen.getByText(/My Library/i)).toBeInTheDocument();
  });

  test('clicking a game card navigates to its details page', () => {
    renderApp('/');
    const firstCard = document.querySelector('.game-card');
    fireEvent.click(firstCard);
    expect(document.querySelector('.game-hero-title')).toBeInTheDocument();
  });

  test('clicking the navbar "Store" link navigates to Store', () => {
    renderApp('/');
    const navLinks = document.querySelector('.navbar-links');
    fireEvent.click(within(navLinks).getByText(/Store/i));
    expect(screen.getByText(/Game Store/i)).toBeInTheDocument();
  });
});