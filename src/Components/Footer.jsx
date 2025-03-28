export const Footer = () => {
    return (
        <footer className="bg-gray-900 dark:bg-gray-800 text-gray-300 dark:text-gray-400 py-4 text-center mt-14">
            <p className="text-sm font-bold ">
                Star Wars Explorer - Datos de{" "}
                <a
                    href="https://swapi.dev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-400 dark:text-blue-300 hover:underline"
                >
                    SWAPI
                </a>
            </p>
        </footer>
    );
};
