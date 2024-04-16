import { browser } from "$app/environment";
import { writable } from "svelte/store";

/**
 * @typedef {{
 * 	_id: number;
 * 	message: string;
 * }} Snack
 */
const init = () => {
    const { subscribe, update } = writable(/** @type {Snack[]} */([]));

    let uuid = 0;
    /** @type {any} */
    let interval;

    /**
     * @param {string} message
     */
    const push = (message) => {
        /**
         * @type {Snack}
         */
        const snack = {
            _id: uuid++,
            message
        };

        if (!browser) return;

        update((snacks) => [snack, ...snacks]);

        if (interval) return;

        interval = setInterval(() => {
            update((snacks) => {
                const v = snacks.slice(0, -1);

                if (!v.length) {
                    clearInterval(interval);
                    interval = null;
                    uuid = 0;
                }

                return v;
            });
        }, 3500);
    };

    /**
     * @param {Snack} snack
     */
    const remove = (snack) => update((snacks) => snacks.filter((s) => s !== snack));

    /** @param {string} message */
    const error = (message) => push(`${message}`);

    /** @param {string} message */
    const success = (message) => push(`${message}`);

    return {
        subscribe,
        remove,

        error,
        success
    };
};

export const snacks = init();
