
export default function useEffect(effect, deps)  {
    const clearup = effect();
    if (!deps) {
        return;
    }

    deps.forEach((dep, i) => {
        dep.addEffect(effect, clearup);
    });
}