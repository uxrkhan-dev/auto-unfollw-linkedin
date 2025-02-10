(async function autoUnfollow() {
    const followButtonSelector = '.artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--secondary.ember-view';
    const confirmButtonSelector = '.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view';

    let totalUnfollowed = 0;
    const maxUnfollows = 250;

    while (totalUnfollowed < maxUnfollows) {
        let buttons = Array.from(document.querySelectorAll(followButtonSelector));

        if (buttons.length === 0) {
            console.log("🔄 No more 'Following' buttons found, scrolling down...");
            window.scrollBy(0, 1000); // Scroll down to load more
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait for content to load
            continue;
        }

        for (let i = 0; i < buttons.length && totalUnfollowed < maxUnfollows; i++) {
            let button = buttons[i];

            // Scroll into view and click the button
            button.scrollIntoView({ behavior: 'smooth', block: 'center' });
            await new Promise(resolve => setTimeout(resolve, 500));
            button.click();
            console.log(`🟢 Clicked "Following" button ${totalUnfollowed + 1}`);

            // Wait for confirmation popup
            let confirmButton = await waitForElement(confirmButtonSelector, 3000);
            if (confirmButton) {
                confirmButton.click();
                console.log(`🔴 Confirmed unfollow ${totalUnfollowed + 1}`);
                totalUnfollowed++;
            }

            // Wait before processing the next one
            await new Promise(resolve => setTimeout(resolve, 2000));
        }

        // Scroll to load more connections
        window.scrollBy(0, 1000);
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log(`✅ Unfollowed ${totalUnfollowed} connections!`);

})();

// Utility function to wait for an element
function waitForElement(selector, timeout = 3000) {
    return new Promise((resolve) => {
        let interval = setInterval(() => {
            let element = document.querySelector(selector);
            if (element) {
                clearInterval(interval);
                resolve(element);
            }
        }, 500);

        setTimeout(() => {
            clearInterval(interval);
            resolve(null);
        }, timeout);
    });
}
