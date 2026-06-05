let dialogOpen = false;
let dialogIndex = 0;
let spaceKey;
let player;
let keys;
let npcWarga;
let interactKey;
let dialogText;
let currentQuest = "";
let questText;
let currentNPC = "";
let npcPetani;
let riceItems = [];
let riceCount = 0;
let riceText;
let playerPoints = 0;
let pointText;

const config = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    parent: "game",
    backgroundColor: "#4CAF50",
    pixelArt: true,

    scene: {
        preload,
        create,
        update
    }
};

const game = new Phaser.Game(config);

function preload() {

    this.load.spritesheet(
        'player_walk_down',
        'assets/player/Walk_Down-Sheet.png',
        {
            frameWidth: 64,
            frameHeight: 64
        }
    );

}

const wargaDialog = [
    "Keadaan desa semakin sulit sejak Jepang datang.",
    "Jepang meminta hasil panen semakin banyak.",
    "Hati-hati jika pergi ke desa sebelah.",
    "Quest Baru: Temui Petani di Sawah."
];

const petaniDialog = [
    "Syukurlah kamu datang.",
    "Panen sedang besar tahun ini.",
    "Bantu aku mengumpulkan 10 padi."
];

const petaniSelesaiDialog = [
    "Terima kasih atas bantuanmu.",
    "Panen kali ini sangat banyak.",
    "Aku akan menukar padi ini menjadi poin kepercayaan.",
    "Kamu mendapatkan 100 poin."
];

function create() {

    // =====================
    // MAP
    // =====================

    this.add.rectangle(
        1500,
        1500,
        3000,
        3000,
        0x4CAF50
    );

    // Rumah pemain

    this.add.rectangle(
        700,
        400,
        250,
        180,
        0x8B4513
    );

    // Sawah

    this.add.rectangle(
        1200,
        900,
        400,
        300,
        0x9ACD32
    );

    // =====================
    // PLAYER
    // =====================

    player = this.add.sprite(
        640,
        360,
        'player_walk_down'
    );

    player.setScale(2);
    player.setDepth(10);

    // =====================
    // NPC
    // =====================

    npcWarga = this.add.rectangle(
        1000,
        500,
        64,
        64,
        0x0000FF
    );

    // =====================
    // DIALOG UI
    // =====================

    dialogText = this.add.text(
        20,
        620,
        "",
        {
            fontSize: "24px",
            backgroundColor: "#000000",
            color: "#FFFFFF",
            padding: {
                x: 10,
                y: 10
            }
        }
    );

    dialogText.setScrollFactor(0);
    dialogText.setDepth(999);

    // =====================
    // ANIMATION
    // =====================

    this.anims.create({
        key: 'walk_down',
        frames: this.anims.generateFrameNumbers(
            'player_walk_down',
            {
                start: 0,
                end: 5
            }
        ),
        frameRate: 10,
        repeat: -1
    });

    // =====================
    // INPUT
    // =====================

    keys = this.input.keyboard.addKeys({
        w: Phaser.Input.Keyboard.KeyCodes.W,
        a: Phaser.Input.Keyboard.KeyCodes.A,
        s: Phaser.Input.Keyboard.KeyCodes.S,
        d: Phaser.Input.Keyboard.KeyCodes.D
    });

    interactKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.E
    );

    // =====================
    // CAMERA
    // =====================

    this.cameras.main.setBounds(
        0,
        0,
        3000,
        3000
    );

    this.cameras.main.startFollow(player);

    spaceKey = this.input.keyboard.addKey(
        Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    questText = this.add.text(
        20,
        20,
        "Quest: -",
        {
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: {
                x: 10,
                y: 10
            }
        }
    );

    questText.setScrollFactor(0);
    questText.setDepth(999);

    npcPetani = this.add.rectangle(
        1200,
        900,
        64,
        64,
        0xffaa00
    );

    for(let i = 0; i < 10; i++)
    {
        let rice = this.add.rectangle(
            1000 + Math.random() * 400,
            800 + Math.random() * 300,
            20,
            20,
            0xffff00
        );

        riceItems.push(rice);
    }

    riceText = this.add.text(
        20,
        70,
        "Padi: 0/10",
        {
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: {
                x: 10,
                y: 10
            }
        }
    );

    riceText.setScrollFactor(0);
    riceText.setDepth(999);

    pointText = this.add.text(
        20,
        120,
        "Poin: 0",
        {
            fontSize: "24px",
            color: "#ffffff",
            backgroundColor: "#000000",
            padding: {
                x: 10,
                y: 10
            }
        }
    );

    pointText.setScrollFactor(0);
    pointText.setDepth(999);
}

function update() {

    const speed = 4;

    let moving = false;

    // =====================
    // MOVEMENT
    // =====================

    if (keys.a.isDown) {
        player.x -= speed;
        moving = true;
    }

    if (keys.d.isDown) {
        player.x += speed;
        moving = true;
    }

    if (keys.w.isDown) {
        player.y -= speed;
        moving = true;
    }

    if (keys.s.isDown) {
        player.y += speed;
        moving = true;
    }

    // =====================
    // ANIMATION
    // =====================

    if (moving) {

        player.play('walk_down', true);

    } else {

        player.stop();
        player.setFrame(0);

    }

    // =====================
    // NPC INTERACTION
    // =====================

    const distance = Phaser.Math.Distance.Between(
        player.x,
        player.y,
        npcWarga.x,
        npcWarga.y
    );

    if (distance < 120) {

        if (!dialogOpen) {
            dialogText.setText(
                "[E] Bicara"
            );
        }

        if (
            Phaser.Input.Keyboard.JustDown(interactKey)
            &&
            !dialogOpen
        ) {

            dialogOpen = true;
            dialogIndex = 0;
            currentNPC = "warga";

            dialogText.setText(
                "Warga Desa\n\n" +
                wargaDialog[dialogIndex]
            );

        }

    }
    else {

        if (!dialogOpen) {
            dialogText.setText("");
        }

    }
    // spacekey
    if (
        dialogOpen &&
        Phaser.Input.Keyboard.JustDown(spaceKey)
    )
    {
        let activeDialog;

        if(currentNPC === "warga") {
            activeDialog = wargaDialog;
        } else if(currentNPC === "petani") {
            activeDialog = petaniDialog;
        } else if(currentNPC === "petani_selesai") {
            activeDialog = petaniSelesaiDialog;
        }

        dialogIndex++;

        if (
            dialogIndex >= activeDialog.length
        )
        {

            dialogOpen = false;
            dialogText.setText("");

            if (
                currentNPC === "warga"
            )
            {
                currentQuest =
                    "Temui Petani di Sawah";

                questText.setText(
                    "Quest: " + currentQuest
                );
            }

            if (
                currentNPC === "petani"
            )
            {
                currentQuest =
                    "Kumpulkan 10 Padi";

                questText.setText(
                    "Quest: " + currentQuest
                );
            }

            if(currentNPC === "petani_selesai")
            {
                playerPoints += 100;

                pointText.setText(
                    "Poin: " + playerPoints
                );

                currentQuest = "Selesai";

                questText.setText(
                    "Quest: Selesai"
                );

                riceCount = 0;

                dialogText.setText(
                    "Quest selesai!\nPoin +100"
                );
            }
        }
        else
        {

            dialogText.setText(
                (currentNPC === "warga"
                    ? "Warga Desa"
                    : "Petani")
                +
                "\n\n"
                +
                activeDialog[dialogIndex]
            );

        }
    }

    const distancePetani =
        Phaser.Math.Distance.Between(
            player.x,
            player.y,
            npcPetani.x,
            npcPetani.y
        );

    if (
        distancePetani < 120
        &&
        currentQuest ===
        "Temui Petani di Sawah"
    )
    {

        if (!dialogOpen)
        {
            dialogText.setText(
                "[E] Bicara dengan Petani"
            );
        }

        if (
            Phaser.Input.Keyboard.JustDown(
                interactKey
            )
            &&
            !dialogOpen
        )
        {

            dialogOpen = true;
            dialogIndex = 0;
            currentNPC = "petani";

            dialogText.setText(
                "Petani\n\n" +
                petaniDialog[0]
            );
        }

    }

    if(
        currentQuest === "Kumpulkan 10 Padi"
        &&
        !dialogOpen
    )
    {
        dialogText.setText(
            "Dekati padi kuning lalu tekan E"
        );
    }

    for(let i = riceItems.length - 1; i >= 0; i--)
    {
        const rice = riceItems[i];

        const distanceRice =
            Phaser.Math.Distance.Between(
                player.x,
                player.y,
                rice.x,
                rice.y
            );

        if(
            currentQuest === "Kumpulkan 10 Padi"
            &&
            distanceRice < 50
            &&
            Phaser.Input.Keyboard.JustDown(interactKey)
        )
        {
            rice.destroy();

            riceItems.splice(i,1);

            riceCount++;

            riceText.setText(
                "Padi: " +
                riceCount +
                "/10"
            );

            if(riceCount >= 10)
            {
                currentQuest =
                    "Kembali ke Petani";

                questText.setText(
                    "Quest: Kembali ke Petani"
                );

                dialogText.setText(
                    "Semua padi terkumpul!\nKembali ke Petani."
                );
            }
        }
    }

    if (
        distancePetani < 120 &&
        currentQuest === "Kembali ke Petani"
    )
    {
        if(!dialogOpen)
        {
            dialogText.setText(
                "[E] Serahkan Padi"
            );
        }

        if(
            Phaser.Input.Keyboard.JustDown(interactKey)
            &&
            !dialogOpen
        )
        {
            dialogOpen = true;
            dialogIndex = 0;
            currentNPC = "petani_selesai";

            dialogText.setText(
                "Petani\n\n" +
                petaniSelesaiDialog[0]
            );
        }
    }
}