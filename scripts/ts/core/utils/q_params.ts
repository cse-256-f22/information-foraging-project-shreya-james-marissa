const qParams = new URL(window.location.href).searchParams;
export const params = {
    wustl_key: '',
    sandbox: false,
    project: '',
    iteration: 0,
    tag: '',
};
try {
    qParams.forEach(console.log);
    if (
        ['wustl_key', 'sandbox', 'project', 'iteration', 'tag'].every((key) => {
            console.log('key: ' + qParams.has(key));
            return qParams.has(key);
        })
    ) {
        params.wustl_key = qParams.get('wustl_key') as string;
        params.sandbox = qParams.get('sandbox') === 'true';
        params.project = qParams.get('project') as string;
        params.iteration = parseInt(qParams.get('iteration') as string, 10);
        params.tag = qParams.get('tag') as string;
    } else {
        console.log('missing query params');
        alert(
            'This HIT is missing neccessary metadata, sorry for the inconvenience. Please contact the Requester as this is not intended to happen.'
        );
    }
} catch (e) {
    console.log(e);
    alert(e);
    alert(
        'This HIT is broken, sorry for the inconvenience. Please contact the Requester as this is not intended to happen.'
    );
}
