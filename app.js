document.addEventListener("DOMContentLoaded", function() {
    const bridgeType = document.getElementById("bridgeType");
    const customBridgeBlock = document.getElementById("customBridgeBlock");
    const generateBtn = document.getElementById("generateBtn");
    const torrcOutput = document.getElementById("torrcOutput");
    const copyBtn = document.getElementById("copyBtn");

    bridgeType.addEventListener("change", function() {
        customBridgeBlock.style.display = bridgeType.value === "custom" ? "" : "none";
    });

    generateBtn.addEventListener("click", function() {
        let config = "";
        const socksPort = document.getElementById("socksPort").value;
        if (socksPort) config += `SocksPort ${socksPort}\n`;

        const protocols = Array.from(document.getElementById("protocols").selectedOptions).map(opt=>opt.value);
        if (protocols.includes("ORPort")) config += "ORPort 9001\n";
        if (protocols.includes("DirPort")) config += "DirPort 9030\n";
        if (protocols.includes("ControlPort")) config += "ControlPort 9051\n";

        const exitNodes = Array.from(document.getElementById("country").selectedOptions).map(opt => opt.value).join(",");
        if (exitNodes) config += `ExitNodes ${exitNodes}\nStrictNodes 1\n`;

        const entryNode = document.getElementById("entryNode").value.trim();
        if (entryNode) config += `EntryNodes ${entryNode}\nStrictNodes 1\n`;

        const excludeNodes = document.getElementById("excludeNodes").value.trim();
        if (excludeNodes) config += `ExcludeNodes ${excludeNodes}\n`;

        const bridgeVal = bridgeType.value;
        if (bridgeVal === "obfs4" || bridgeVal === "meek" || bridgeVal === "snowflake") {
            config += "UseBridges 1\n";
            if (bridgeVal === "obfs4") {
                config += "ClientTransportPlugin obfs4 exec /usr/bin/obfs4proxy\n";
            }
            if (bridgeVal === "meek") {
                config += "ClientTransportPlugin meek exec /usr/bin/meek-client\n";
                config += "Bridge meek 0.0.2.0:1\n";
            }
            if (bridgeVal === "snowflake") {
                config += "ClientTransportPlugin snowflake exec /usr/bin/snowflake-client\n";
                config += "Bridge snowflake 192.0.2.3:1\n";
            }
        } else if (bridgeVal === "custom") {
            config += "UseBridges 1\n";
            const bridges = document.getElementById("customBridges").value.trim();
            if (bridges) {
                config += bridges.split('\n').map(line => line.trim()).filter(line => line.length > 0).map(line => `Bridge ${line.replace(/^Bridge\s*/,'')}`).join('\n') + '\n';
            }
        }

        if (document.getElementById("runAsDaemon").checked) config += "RunAsDaemon 1\n";
        torrcOutput.value = config.trim();
    });

    copyBtn.addEventListener("click", function() {
        torrcOutput.select();
        document.execCommand("copy");
        copyBtn.innerText = "Kopyalandı!";
        setTimeout(() => { copyBtn.innerText = "Kopyala"; }, 1300);
    });
});