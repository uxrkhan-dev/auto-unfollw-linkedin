(async function autoUnfollow() {
    const followButtonSelector = '.artdeco-button.artdeco-button--muted.artdeco-button--2.artdeco-button--secondary.ember-view';
    const confirmPopupSelector = '.artdeco-modal__actionbar.artdeco-modal__actionbar--confirm-dialog.artdeco-modal__actionbar.ember-view';
    const confirmButtonSelector = '.artdeco-button.artdeco-button--2.artdeco-button--primary.ember-view';

    let buttons = Array.from(document.querySelectorAll(followButtonSelector));
    console.log(`✅ Found ${buttons.length} "Following" buttons`);

    for (let i = 0; i < buttons.length; i++) {
        let button = buttons[i];

        // Scroll into view and click the button
        button.scrollIntoView({ behavior: 'smooth', block: 'center' });
        await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
        button.click();
        console.log(`🟢 Clicked "Following" button ${i + 1}`);

        // Wait for confirmation popup
        let confirmPopup = await waitForElement(confirmPopupSelector, 2000);
        if (confirmPopup) {
            let confirmButton = confirmPopup.querySelector(confirmButtonSelector);
            if (confirmButton) {
                confirmButton.click();
                console.log(`🔴 Confirmed unfollow ${i + 1}`);
            }
        }

        // Wait before processing the next one
        await new Promise(resolve => setTimeout(resolve, 2000));
    }

    console.log("✅ Unfollow process completed!");
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
