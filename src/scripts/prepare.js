const { exec } = require('child_process');
const semver = require('semver');

exec('tns --version', (err, stdout, stderr) => {
    if (err) {
        // node couldn't execute the command
        console.log(`tns --version err: ${err}`);
        return;
    }

    const regex = /^(?:\d+\.){2}\d+.*?$/m;
    const matches = stdout.match(regex);
    console.log("Extracted tns version: " + matches[0]);
    const tnsVersion = semver.major(semver.coerce(matches[0]));
    
    // execute 'tns plugin build' for {N} version > 4. This command builds .aar in platforms/android folder.
    if (tnsVersion >= 4) {
        console.log(`executing 'tns plugin build'`);
        exec('tns plugin build');
    }
});