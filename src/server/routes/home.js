module.exports = [
  {
    method: 'GET',
    path: '/',
    config: {
      handler: (request, h) => {
        const context = {
          title: 'Hangahanga - Habit Tracker',
          isAuthenticated: false
        };
        context.state = `window.state = ${JSON.stringify(context)};`;
        return h.view('home/index', context);
      }
    }
  }
];
