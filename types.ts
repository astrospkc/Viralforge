export type AuthState = {
    user: any;
    isAuthenticated: boolean;
    userLoading: boolean;
    token: string;
    setToken: (value: string) => void;
    setUser: (user: User) => void;
    setIsAuthenticated: (value: boolean) => void;
    setUserLoading: (value: boolean) => void;
    logout: () => void;
}

export type User = {
    id: string;
    name: string;
    email: string;
    createdAt: string;
    updatedAt: string;
}