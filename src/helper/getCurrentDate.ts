interface DateTimeFormatOptions {
    day?: 'numeric' | '2-digit';
    month?: 'numeric' | '2-digit' | 'short' | 'long';
}

export const getCurrentDate = () => {
    const currentDate = new Date();
    const options: DateTimeFormatOptions = { day: 'numeric', month: 'short' };
    return currentDate.toLocaleDateString('en-US', options);
}