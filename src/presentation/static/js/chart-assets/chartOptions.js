function getChartOptions() {
    return {
      scales: {
        x: { display: false },
        y: { beginAtZero: true, display: false }
      },
      plugins: {
        legend: { display: false }
      },

      animation: {
        duration: 3000,
        easing: 'easeInOutQuad'
      }
      
    };
  }
  