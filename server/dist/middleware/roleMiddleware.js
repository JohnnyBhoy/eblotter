export const authorize = (...roles) => (req, res, next) => {
    if (!req.user || !roles.includes(req.user.role)) {
        res.status(403).json({ message: 'Access denied: insufficient permissions' });
        return;
    }
    next();
};
//# sourceMappingURL=roleMiddleware.js.map