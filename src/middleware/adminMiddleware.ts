export const isAdmin = async (req, res, next): Promise<void> => {
    if (!req.user) {
        return res.json({ message: 'something went wrong' });
    }
    const user = req.user;
    if (user.status !== 'admin' && user.status !== 'manager') return res.status(403).json({ message: 'Access denied' });
    next();
};
