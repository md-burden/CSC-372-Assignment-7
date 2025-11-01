const BASEURL = "/jokebook";

// Wait for DOM and stylesheets to fully load
document.addEventListener('DOMContentLoaded', async () => {
    const searchBar = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const categoriesButton = document.getElementById("categories-button");
    const randomButton = document.getElementById("random-button");
    const createJokeButton = document.getElementById("create-joke-button");
    const jokeOfTheDay = document.getElementById("joke-of-the-day");
    const jokeOfTheDayFooter = document.getElementById("jotd-footer");

    const randomJoke = await getRandomJoke();
    displayJokeOfTheDay(randomJoke, jokeOfTheDay, jokeOfTheDayFooter);

    categoriesButton.addEventListener("click", async () => await displayJokeCategories());

    searchButton.addEventListener("click", async () => {
        const jokes = await getJokesByCategory(searchBar.value);
        displayJokes(jokes, searchBar.value);
    });

    randomButton.addEventListener("click", async () => {
        await getRandomJoke().then((joke) => {
            displayJokeOfTheDay(joke, jokeOfTheDay, jokeOfTheDayFooter);
        });
    });

    createJokeButton.addEventListener("click", () => {
        buildJokeForm();
    });
});

async function getRandomJoke() {
    try {
        return await fetch(`${BASEURL}/random`).then(async (response) => {
            const json = await response.json();
            return json;
        });
    } catch (error) {
        console.error("Error fetching random joke:", error);
    }
}

async function getJokeGategories() {
    try {
        return await fetch(`${BASEURL}/categories`).then(async (response) => {
            const json = await response.json();
            return json;
        });
    } catch (error) {
        console.error("Error fetching joke categories:", error);
        return [];
    }
}

async function getJokesByCategory(category, limit = 10) {
    if (category.trim() === "") {
        return [];
    }

    try {
        return await fetch(`${BASEURL}/category/${category}?limit=${limit}`).then(async (response) => {
            const json = await response.json();
            return json;
        });
    } catch (error) {
        console.error(`Error fetching jokes for category ${category}:`, error);
        return [];
    }
}

async function addJoke(joke) {
    try {
        return await fetch(`${BASEURL}/joke/add`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(joke)
        }).then(async (response) => {
            const json = await response.json();
            return json;
        });
    } catch (error) {
        console.error(`Error fetching jokes for category ${category}:`, error);
        return [];
    }
}

function displayJokeOfTheDay(joke, jokeOfTheDay, jokeOfTheDayFooter) {
    const setup = jokeOfTheDay.querySelector("#jotd-setup");
    const delivery = jokeOfTheDay.querySelector("#jotd-delivery");
    const id = jokeOfTheDayFooter.querySelector(".joke-id");
    const category = jokeOfTheDayFooter.querySelector(".joke-category");

    setup.textContent = joke.joke[0].setup;
    delivery.textContent = joke.joke[0].delivery;
    category.textContent = `Category: ${joke.joke[0].joke_type}`;
    id.textContent = `ID: #${joke.joke[0].id}`;
}

async function displayJokeCategories() {
    const categoryButtonsContainer = document.getElementById("category-buttons-container");

    if (categoryButtonsContainer.classList.contains('show')) {
        categoryButtonsContainer.classList.remove('show');
        return;
    }

    if (categoryButtonsContainer.childElementCount === 0) {
        const categories = await getJokeGategories();

        categories.categories.forEach(category => {
            const button = document.createElement("button");
            button.className = "action-btn";
            button.textContent = category.joke_type.toUpperCase();
            button.addEventListener("click", async () => {
                const jokes = await getJokesByCategory(category.joke_type);
                displayJokes(jokes, category.joke_type);
            });
            categoryButtonsContainer.appendChild(button);
        });
    }

    categoryButtonsContainer.classList.add('show');
}

async function displayJokes(jokes, jokeType) {
    let jokesContainer = document.getElementById("jokes-container");
    let jokeForm = document.getElementById("joke-form");

    if (jokeForm) {
        jokeForm.remove();
    }

    if (!jokesContainer) {
        jokesContainer = document.createElement('div');
        jokesContainer.id = 'jokes-container';
        jokesContainer.className = 'ugly-container';
        document.body.appendChild(jokesContainer);
    }

    jokesContainer.replaceChildren();

    buildCardHeader(jokesContainer, `${jokeType.toUpperCase()} JOKES!`);

    jokes.jokes.forEach(joke => {
        const jokeCard = document.createElement('div');
        jokeCard.className = 'category-joke';

        // Create joke content
        const jokeContent = document.createElement('div');
        jokeContent.className = 'joke-content';

        const setup = document.createElement('p');
        setup.className = 'joke-setup';
        setup.textContent = joke.setup;

        const delivery = document.createElement('p');
        delivery.className = 'joke-delivery';
        delivery.textContent = joke.delivery;

        jokeContent.appendChild(setup);
        jokeContent.appendChild(delivery);

        // Create footer
        const footer = document.createElement('div');
        footer.className = 'joke-footer';

        const category = document.createElement('span');
        category.className = 'joke-category';
        category.textContent = `Category: ${joke.joke_type}`;

        const id = document.createElement('span');
        id.className = 'joke-id';
        id.textContent = `ID: #${joke.id}`;

        footer.appendChild(category);
        footer.appendChild(id);

        jokeCard.appendChild(jokeContent);
        jokeCard.appendChild(footer);

        jokesContainer.appendChild(jokeCard);
    });

    setTimeout(() => {
        jokesContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function buildJokeForm() {
    let jokesContainer = document.getElementById("jokes-container");

    if (jokesContainer) {
        jokesContainer.remove();
    }

    let jokeFormContainer = document.createElement("div");
    jokeFormContainer.className = "ugly-container";
    jokeFormContainer.id = "joke-form";

    buildCardHeader(jokeFormContainer, "Create a New Joke!");

    let jokeForm = document.createElement("form");
    jokeForm.className = "ugly-form";

    buildFormInputWithLabel(jokeForm, "Setup", "setup");
    buildFormInputWithLabel(jokeForm, "Delivery", "delivery");
    buildFormInputWithLabel(jokeForm, "Category", "category");

    let submitButton = document.createElement("button");
    submitButton.type = "submit";
    submitButton.className = "action-btn";
    submitButton.textContent = "Submit Joke";

    submitButton.addEventListener("click", submitJokeForm);

    jokeForm.appendChild(submitButton);

    jokeFormContainer.appendChild(jokeForm);

    document.body.appendChild(jokeFormContainer);

    setTimeout(() => {
        jokeFormContainer.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

function buildFormInputWithLabel(form, labelText, inputName) {
    const label = document.createElement("label");
    label.textContent = labelText;
    label.htmlFor = inputName;
    label.className = "ugly-label";

    const input = document.createElement("input");
    input.type = "text";
    input.id = inputName;
    input.name = inputName;
    input.className = "ugly-input";

    form.appendChild(label);
    form.appendChild(input);
}

async function submitJokeForm(event) {
    event.preventDefault();
    
    const setup = document.getElementById("setup").value;
    const delivery = document.getElementById("delivery").value;
    const category = document.getElementById("category").value;

    if (!setup || !delivery || !category) {
        showCustomAlert("Please fill in all fields!");
        return;
    }

    if(category!== "funny" && category !== "lame"){
        showCustomAlert("Category must be either 'funny' or 'lame'!");
        return;
    }
    
    const joke = {
        setup: setup,
        delivery: delivery,
        joke_type: category
    }

    const addedJoke = await addJoke(joke);

    console.log(addedJoke.joke.joke_type);

    if(addedJoke.joke.joke_type) {
        alert("Joke submitted successfully!");

        let jokeForm = document.getElementById("joke-form");
        if (jokeForm) {
            jokeForm.remove();
            const jokes = await getJokesByCategory(addedJoke.joke.joke_type);
            displayJokes(jokes, addedJoke.joke.joke_type);
        }
        
    }
}

function buildCardHeader(div, headerTitle) {
    const headerContainer = document.createElement('div');
    headerContainer.className = 'jokes-header-container';

    const leftSpacer = document.createElement('div');

    const jokesHeader = document.createElement('h2');
    jokesHeader.textContent = headerTitle;

    const closeButton = document.createElement('button');
    closeButton.className = 'action-btn';
    closeButton.textContent = 'Close';
    closeButton.addEventListener('click', () => {
        div.remove();
    });

    headerContainer.appendChild(leftSpacer);
    headerContainer.appendChild(jokesHeader);
    headerContainer.appendChild(closeButton);

    div.appendChild(headerContainer);
}

function showCustomAlert(message) {
    // Create overlay
    const overlay = document.createElement('div');
    overlay.className = 'custom-alert-overlay';
    
    // Create alert box
    const alertBox = document.createElement('div');
    alertBox.className = 'custom-alert';
    
    const title = document.createElement('h3');
    title.textContent = 'Alert!';
    
    const messageText = document.createElement('p');
    messageText.textContent = message;
    
    const okButton = document.createElement('button');
    okButton.textContent = 'OK!';
    okButton.addEventListener('click', () => {
        overlay.remove();
        alertBox.remove();
    });
    
    alertBox.appendChild(title);
    alertBox.appendChild(messageText);
    alertBox.appendChild(okButton);
    
    document.body.appendChild(overlay);
    document.body.appendChild(alertBox);
}