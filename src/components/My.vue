<template>
    <div class="my">
        <Panel :width="280" :height="0">
            <template #head></template>
            <template #content>
                <p class="tellme">联系站主</p>
                <img
                    src="../assets/images/6D20C9DF5C9D2BBCF95BC7043AA65B3A.jpg"
                    alt=""
                />
            </template>
        </Panel>
    </div>
</template>

<script>
import Panel from "../layout/Panel.vue";
export default {
    components: { Panel },
};
</script>

<style lang="less" scoped>
.my {
    margin-top: 10px;
    img{
        width: 100%;
    }
    .tellme{
        margin: 0;
        text-align: center;
        font-size: 18px;
        letter-spacing: 1.3px;
    }
}
</style>