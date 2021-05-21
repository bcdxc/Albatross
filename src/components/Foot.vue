<template>
    <div class="foot">
        <p>
            <a
                class="p-item"
                href="https://github.com/bcdxc/Albatross"
                target="_blank"
            >
                <i class="iconfont my-github icon-github"></i>
                <span>Github源码</span>
            </a>
            <a class="p-item" href="https://github.com/bcdxc" target="_blank">
                <span>联系我</span>
            </a>
            <span class="p-item">Completed in 2021</span>
        </p>
        <p class="slogan">条条大路通罗马</p>
    </div>
</template>

<script>
export default {};
</script>

<style lang="less">
.foot {
    display: flex;
    height: 100px;
    flex-direction: column;
    justify-content: center;
    background-color: #5abdc1;
    margin-top: 30px;
    p {
        text-align: center;
        margin: 0;
        color: rgba(238, 238, 238, 0.8);
        &:first-child {
            margin-bottom: 10px;
        }
        .my-github {
            color: #000;
            margin-right: 5px;
        }
        a {
            color: rgba(238, 238, 238, 0.8);
            transition: color 0.5s;
            &:hover {
                color: #fff;
            }
        }
        .p-item {
            margin-right: 20px;
        }
    }
    .slogan{
        letter-spacing: 1.2px;
    }
}
</style>