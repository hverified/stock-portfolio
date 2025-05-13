const currencyFormat = (value) => {
    return new Intl.NumberFormat('en-IN').format(value)
};

export default (currencyFormat);