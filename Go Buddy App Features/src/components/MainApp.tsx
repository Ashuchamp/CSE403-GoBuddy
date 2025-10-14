import { useState } from "react";
import { LogOut } from "lucide-react";
import { User } from "../App";
import { Navigation } from "./Navigation";
import { ProfileView } from "./ProfileView";
import { BrowseView } from "./BrowseView";
import { ConnectionsView } from "./ConnectionsView";
import { RecommendationsView } from "./RecommendationsView";
import { CreateActivityView } from "./CreateActivityView";
import { Button } from "./ui/button";

type MainAppProps = {
  currentUser: User;
  onLogout: () => void;
};

export type AppView =
  | "browse"
  | "recommendations"
  | "create"
  | "connections"
  | "profile";

export function MainApp({
  currentUser,
  onLogout,
}: MainAppProps) {
  const [currentView, setCurrentView] =
    useState<AppView>("browse");

  return (
    <div className="min-h-screen bg-gray-50 pb-16">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="text-purple-600">GoBuddy</h1>
          <Button
            variant="ghost"
            onClick={onLogout}
            className="text-gray-600 hover:text-gray-900 px-3"
            title="Logout"
            aria-label="Logout"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {currentView === "browse" && (
          <BrowseView currentUser={currentUser} />
        )}
        {currentView === "recommendations" && (
          <RecommendationsView currentUser={currentUser} />
        )}
        {currentView === "create" && (
          <CreateActivityView currentUser={currentUser} />
        )}
        {currentView === "connections" && (
          <ConnectionsView currentUser={currentUser} />
        )}
        {currentView === "profile" && (
          <ProfileView
            user={currentUser}
            isCurrentUser={true}
          />
        )}
      </main>

      {/* Bottom Navigation */}
      <Navigation
        currentView={currentView}
        onViewChange={setCurrentView}
      />
    </div>
  );
}