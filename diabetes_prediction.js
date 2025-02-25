//import * as tf from "@tensorflow/tfjs";
//import * as tfvis from "@tensorflow/tfjs-vis";
//import * as Plotly from "plotly.js-dist-min";
//import * as Papa from "papaparse";


const load_data = async () => {

    const csv = "./data/diabetes.csv"
    const csv_data = tf.data.csv(csv, {
        columnConfigs: {
            Outcome: {
                isLabel: true
            }
        }
    })

    console.log(csv_data);

    //const Features = (await csv_data.columnNames()).length - 1;
    const Features = 8;
    const convert_data = csv_data.map(({xs, ys}) => {
        const lables = [
            ys.Outcome == 1,
            ys.Outcome == 0
        ]
        return {
            xs: Object.values(xs),
            ys: Object.values(lables)
        }
    }).batch(32)

    console.log(convert_data)

    const model = tf.sequential({
        layers: [
            tf.layers.dense({
                units: 256,
                activation: "sigmoid",
                inputShape: [8]
            }),
            tf.layers.dense({
                units: 256,
                activation: "sigmoid"
            }),
            tf.layers.dense({
                units: 256,
                activation: "sigmoid"
            }),
            tf.layers.dense({
                units: 2,
                activation: "sigmoid"
            })

        ]
    });
    console.log(model)

    const trainLogs = [];
    const lossContainer = document.getElementById("loss-count");
    const accContainer = document.getElementById("acc-count");

    model.compile({
        loss: "binaryCrossentropy",
        optimizer: tf.train.adam(0.001),
        metrics: ["accuracy"]
    })

    model.summary()

    //await model.fitDataset(convert_data, {
    //    epochs: 300,
    //    callbacks: tf.callbacks.earlyStopping({
    //        monitor: "loss"
    //    })

    //})

    const surface = {name: 'show.fitCallbacks', tab: 'Training'};

    await model.fitDataset(convert_data, {
        epochs: 200,
        callbacks: {
            onEpochEnd: async (epoch, logs) => {
                trainLogs.push(logs);
                tfvis.show.history(lossContainer, trainLogs, ['loss']);
                tfvis.show.history(accContainer, trainLogs, ['acc']);
            }

        }
    })




    //await model.save('downloads://diabetes-detection');

    const test_value_1 = tf.tensor2d([7, 194, 68, 28, 0, 35.9, 0.745, 41], [1, 8]);
    const test_value_2 = tf.tensor2d([4, 141, 74, 0, 0, 27.6, 0.244, 40], [1, 8]);
    const prediction = model.predict(test_value_1);
    const pIndex = tf.argMax(prediction, axis = 1).dataSync();

    const classNames = ["Diabetic", "Healthy"];

    test_value_1.print()
    prediction.print()
    test_value_1.dispose();
    prediction.dispose();
    console.log(prediction);
    console.log(classNames[pIndex]);


}

//load_data();
