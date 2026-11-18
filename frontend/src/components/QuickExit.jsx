function QuickExit() {
  const handleQuickExit = () => {
    // Hide the current page immediately
    document.body.style.visibility = "hidden";

    // Replace the current AEGIRA page with a neutral page
    window.location.replace("https://www.google.com/");
  };

  return (
    <button
      className="quick-exit-button"
      onClick={handleQuickExit}
      title="Leave AEGIRA quickly"
      aria-label="Quick Exit"
    >
      Quick Exit ↗
    </button>
  );
}

export default QuickExit;