/*
	Recoil state migration script

	1. Get saved recoil state from localstorage (localStorage.getItem('recoil-persist'))
	2. Extract each state from 'recoil-persist', convert it for jotai

	*/

if (window.localStorage.getItem('recoil-persist')) {
  try {
    Object.entries(
      JSON.parse(window.localStorage.getItem('recoil-persist') ?? ''),
    ).forEach(([k, v]) => {
      window.localStorage.setItem(k, JSON.stringify(v));
      console.log(`Migrated recoil state "${k}" to jotai state`);
    });

    window.localStorage.removeItem('recoil-persist');
  } catch (error) {
    console.error('Failed to migrate recoil states to jotai', error);
  }
}
