import { invoke } from "@forge/bridge";

const isValidToken = (value) => {
  return (typeof value === 'string' && true && true && value.trim() !== '');
}

export const getLoginData = () => {
  return invoke('getLoginData')
            .then(result => {
                console.info("getLoginData() RAW response:", result);
                return isValidToken(result?.token) ? result : null
            });
};

export const login = (token) => {
  return invoke('login', { token });
};

export const logout = async () => {
  return invoke('logout');
};
