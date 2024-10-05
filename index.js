import axios from 'https://cdn.jsdelivr.net/npm/axios@1.7.7/+esm';

const convert = (value) => value
    .toUpperCase()
    .trim()
    .split(' ')
    .filter((el) => el !== 'IN');

const render = (state) => {
    const form = document.querySelector('form');
    const maincontainer = document.querySelector('.maincontainer');
    const chooseSource = document.querySelector('#chooseSource');
    const subcontainer = document.querySelector('.subcontainer');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();
        const formData = new FormData(form);
        const arrExpression = convert(formData.get('currency'));

        state.convert.from = arrExpression[1];
        state.convert.to = arrExpression[2];
        state.convert.amount = arrExpression[0];

        await axios
            .get('https://api.currencylayer.com/'
                + state.convert.endpoint
                + '?access_key=' + state.access_key
                + '&from=' + state.convert.from
                + '&to=' + state.convert.to
                + '&amount=' + state.convert.amount
            )
            .then(({ data }) => {
                maincontainer.textContent = `${data.result}`;
        });
    });

    chooseSource.addEventListener('change', async (e) => {
        e.preventDefault();
        state.source = e.target.value;
        await axios
            .get('https://api.currencylayer.com/live'
                + '?access_key=' + state.access_key
                + '&source=' + state.source
            )
            .then(({ data }) => {
                subcontainer.innerHTML = '';
                for (const [key, value] of Object.entries(data.quotes)) {
                    const a = document.createElement('a');
                    const val = 1 / value;
                    a.textContent = `${key.slice(3)}: ${val.toFixed(2)}`;
                    subcontainer.append(a);
                }
            });
    });
};

const runApp = async () => {
    const state = {
        access_key: 'd957e6c3b6c543e40bbcf03efa8399bf',
        source: "RUB",
        data: {},
        convert: {
            endpoint: 'convert',
            from: '',
            to: '',
            amount: '',
        },
    };
    const subcontainer = document.querySelector('.subcontainer');

    await axios
        .get('https://api.currencylayer.com/live'
            + '?access_key=' + state.access_key
            + '&source=' + state.source
        )
        .then(({ data }) => {
            subcontainer.innerHTML = '';
            for (const [key, value] of Object.entries(data.quotes)) {
                const a = document.createElement('a');
                const val = 1 / value;
                a.textContent = `${key.slice(3)}: ${val.toFixed(2)}`;
                a.classList.add('list-el');
                subcontainer.append(a);
            }
        });

    render(state);
};

runApp();